# Plan de Testing — Layers + Criterios Gate POC

| Campo | Valor |
|---|---|
| Código | GDP-TST-001 |
| Versión | 1.0 |
| Estado | Aprobado (Fase 3-A3) |
| Fecha | 2026-08-05 |
| Propietario | David Ernesto Antequera Martínez (Líder QA) |
| Revisores | Antonio José Escrucería Uribe (Arquitecto), Álvaro Patiño Cruz (PO) |
| Aplicable | POC-001 (Sep 30) y POC-002 (Nov 30) |

## Propósito

Estrategia testing integrada (unit → integration → e2e → security) para garantizar calidad MVP con énfasis en:
- Aislamiento multitenant (0% cross-tenant leaks)
- Idempotencia (sin duplicaciones)
- Integridad documental (hash, antivirus)
- Auditoría completa (trazabilidad 100%)

---

## 1. Pirámide de Testing

```
           ╔════════════════════════╗
           ║ Security & Compliance  ║ 5%
           ║ (OWASP ZAP, pen tests) ║
           ╚════════════════════════╝
           ╔════════════════════════╗
           ║ E2E / User Journeys    ║ 10%
           ║ (Playwright)           ║
           ╠════════════════════════╣
           ║ Integration Tests      ║ 25%
           ║ (Testcontainers)       ║
           ╠════════════════════════╣
           ║ Unit Tests             ║ 60%
           ║ (Vitest, mocks)        ║
           ╚════════════════════════╝

Cobertura objetivo: >80% (críticos 100%)
Herramientas: Vitest, Supertest, Testcontainers, Playwright, OWASP ZAP
```

---

## 2. Layer 1: Unit Tests (Vitest)

**Alcance:** Lógica de negocio (domain layer), utilidades, validators.

**Herramientas:** Vitest, @testing-library/jest-dom, Mock Service Worker (MSW)

**Ejemplo test:**

```typescript
// tests/domain/sequence-generator.spec.ts
describe('SequenceGenerator', () => {
  it('generates unique sequence numbers without collision', () => {
    const gen = new SequenceGenerator('RAD-', 'incoming');
    
    const nums = Array.from({ length: 1000 }).map(() =>
      gen.next()
    );
    
    const unique = new Set(nums);
    expect(unique.size).toBe(1000); // Sin duplicación
  });

  it('respects tenant isolation in sequences', () => {
    const gen1 = new SequenceGenerator('RAD-', 'incoming', tenantA);
    const gen2 = new SequenceGenerator('RAD-', 'incoming', tenantB);
    
    const num1 = gen1.next();
    const num2 = gen2.next();
    
    expect(num1).not.toBe(num2); // Secuencias independientes
  });

  it('fails securely if sequence overflows', () => {
    const gen = new SequenceGenerator('RAD-', 'incoming', tenant, 999999);
    
    Array.from({ length: 999999 }).forEach(() => gen.next());
    
    expect(() => gen.next()).toThrow(SequenceExhaustedError);
  });
});
```

**Cobertura esperada:** >85% (domain layer)

---

## 3. Layer 2: Integration Tests (Testcontainers)

**Alcance:** Servicios + BD (PostgreSQL real) + RLS + Outbox/Inbox.

**Herramientas:** Testcontainers, Supertest, pg (driver), jest-each

**Ejemplo test:**

```typescript
// tests/integration/document-core-service.spec.ts
describe('Document Core Service — Multitenant', () => {
  let db: pg.Pool;
  let app: NestApplication;

  beforeAll(async () => {
    // Contenedor PostgreSQL con RLS habilitado
    const postgres = await new PostgreSqlContainer()
      .withDatabase('test_sgd')
      .withUsername('test')
      .withPassword('test')
      .withExposedPorts(5432)
      .start();

    db = new pg.Pool({
      host: postgres.getHost(),
      port: postgres.getMappedPort(5432),
      database: 'test_sgd',
      user: 'test',
      password: 'test',
    });

    // Migrations
    await runMigrations(db);
    await enableRLSPolicies(db);

    // Nest app
    const module = await Test.createTestingModule({
      imports: [DocumentCoreModule],
      providers: [
        { provide: 'DB_CONNECTION', useValue: db },
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  it('RLS prevents tenant A reading tenant B documents', async () => {
    // Setup: Crear 2 tenants, cada uno con 1 documento
    const tenantA = await seedTenant(db, { name: 'Venus' });
    const tenantB = await seedTenant(db, { name: 'OtherCorp' });

    const docA = await createDocument(db, tenantA, { title: 'Secret Doc' });
    const docB = await createDocument(db, tenantB, { title: 'Other Doc' });

    // UserA logueado en tenantA
    const userA = await seedUser(db, tenantA);
    const tokenA = signJWT({ sub: userA.id, tenant_id: tenantA });

    // UserA intenta leer docB (diferente tenant)
    const response = await supertest(app.getHttpServer())
      .get(`/documents/${docB.id}`)
      .set('Authorization', `Bearer ${tokenA}`)
      .set('X-Tenant-ID', tenantB); // Incluso si lo trata de forzar

    expect(response.status).toBe(404); // RLS lo filtró
  });

  it('Idempotency prevents duplicate radicaciones', async () => {
    const tenant = await seedTenant(db);
    const idempotencyKey = 'radicacion-2026-001-key';

    // Primera radicación
    const res1 = await supertest(app.getHttpServer())
      .post('/correspondences/incoming')
      .set('X-Idempotency-Key', idempotencyKey)
      .send({ subject: 'Test', sender_name: 'John' });

    const num1 = res1.body.number;

    // Reintento con mismo idempotency key
    const res2 = await supertest(app.getHttpServer())
      .post('/correspondences/incoming')
      .set('X-Idempotency-Key', idempotencyKey)
      .send({ subject: 'Test', sender_name: 'John' });

    const num2 = res2.body.number;

    expect(num1).toBe(num2); // Mismo número, sin duplicación
  });

  it('Audit logs are immutable', async () => {
    const tenant = await seedTenant(db);
    const doc = await createDocument(db, tenant);

    // Log creación
    const logs = await db.query(
      'SELECT * FROM audit_logs WHERE entity_id = $1',
      [doc.id]
    );

    expect(logs.rows.length).toBeGreaterThan(0);

    // Intentar modificar log (debe fallar o no tener permiso)
    const updateQuery = 'UPDATE audit_logs SET action = $1 WHERE id = $2';
    const result = await db.query(updateQuery, ['hacked', logs.rows[0].id]);

    // Sin actualización (RLS o permiso denegado)
    expect(result.rowCount).toBe(0);
  });
});
```

**Cobertura esperada:** >70% (integration paths)

---

## 4. Layer 3: E2E Tests (Playwright)

**Alcance:** Flujos usuario completos (browser automation).

**Herramientas:** Playwright, Page Object Model (POM)

**Ejemplo test:**

```typescript
// tests/e2e/radicacion-workflow.spec.ts
import { test, expect, Page } from '@playwright/test';

test.describe('Radicación Entrada E2E', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('http://localhost:3000/login');
    
    // Autenticarse (mock Keycloak)
    await page.fill('input[name="email"]', 'secretaria@venus.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button:has-text("Entrar")');
    
    await page.waitForNavigation();
  });

  test('Radicar entrada con documento adjunto', async () => {
    // 1. Navegar a radicación
    await page.click('a:has-text("Radicar entrada")');
    
    // 2. Llenar formulario
    await page.fill('input[name="subject"]', 'Solicitud información');
    await page.fill('input[name="sender_name"]', 'Cliente ABC');
    await page.fill('input[name="sender_email"]', 'cliente@abc.com');

    // 3. Subir archivo
    const fileInput = await page.$('input[type="file"]');
    await fileInput?.setInputFiles('tests/fixtures/solicitud.pdf');

    // 4. Enviar
    await page.click('button:has-text("Radicar")');

    // 5. Validar éxito
    await expect(page).toHaveURL(/\/radicaciones\/.+/);
    
    const radicNumber = await page.locator(
      '.receipt-number'
    ).textContent();
    
    expect(radicNumber).toMatch(/RAD-\d{4}-\d{5}/);

    // 6. Descargar comprobante
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Descargar comprobante")');
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toContain('comprobante');
  });

  test('Búsqueda después de radicación', async () => {
    // Radicar primero (setup)
    await radicarEntrada(page, {
      subject: 'Trámite urgente',
      sender_name: 'Organismo X',
    });

    // Navegar a búsqueda
    await page.click('a:has-text("Buscar")');

    // Buscar por asunto
    await page.fill('input[placeholder="Buscar..."]', 'Trámite urgente');
    await page.click('button:has-text("Buscar")');

    // Validar resultado
    const results = await page.locator('.search-result').count();
    expect(results).toBeGreaterThan(0);

    // Abrir resultado
    await page.click('.search-result:first-child');

    // Validar contenido
    const title = await page.locator('h1').textContent();
    expect(title).toContain('Trámite urgente');
  });
});
```

**Cobertura esperada:** Critical user journeys (100%)

---

## 5. Layer 4: Security Testing (OWASP ZAP + Manual)

**Alcance:** Inyección SQL, XSS, CSRF, autenticación, autorización, criptografía.

**Herramientas:** OWASP ZAP, Burp Suite (manual pen test), npm audit

**Checklist:**

- [ ] ZAP automated scan (baseline)
- [ ] Manual SQL injection attempts (prepared statements validated)
- [ ] CSRF token validation (SameSite cookies)
- [ ] Cross-origin request handling (CORS policies)
- [ ] JWT signature validation (token tampering)
- [ ] Tenant isolation under attack (forced parameter changes)
- [ ] Secrets in logs/errors (sanitization verified)
- [ ] Rate limiting (DDoS resistance)
- [ ] Dependency vulnerabilities (npm audit, dependabot)

**Ejemplo ZAP scan:**

```bash
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t http://localhost:3000/api/v1 \
  -r zap-report.html \
  -J zap-results.json
```

**Criterios pass:** 0 riesgos críticos, máximo 5 medios

---

## 6. Criterios gate POC-001 (Multitenancy, RLS, Keycloak)

**Fecha target:** 2026-09-30

**Requisitos:** Todos deben ser ✅

| ID | Criterio | Herramienta | Pass/Fail |
|---|---|---|---|
| **G-AUTH** | Keycloak integrado, JWT validados | Unit + Supertest | ✅ 100% tests pass |
| **G-IAM** | Crear org, invitar usuarios, vincular identidades | E2E Playwright | ✅ Critical journey 100% |
| **G-TENANT-ISO** | User A NO ve User B tenant (RLS) | Integration Testcontainers | ✅ 0/1000 leaks |
| **G-PERMS** | Roles+permisos funcionales | Unit + Integration | ✅ >95% cobertura |
| **G-CONTEXT** | Cambio tenant sin fugas | Integration + E2E | ✅ Cross-tenant attacks fail |
| **G-AUDIT** | Auditoría log de cambio tenant | Integration | ✅ 100% eventos logged |
| **G-PERFORMANCE** | Login <2s, context switch <1s | k6 load test | ✅ p95 <2s, p99 <5s |
| **G-SECURITY-SCAN** | ZAP scan críticos=0 | OWASP ZAP | ✅ 0 críticos |

**Go/No-Go Decision:** Todos ✅ → POC-002 autorizado

---

## 7. Criterios gate POC-002 (Carga Documental, Antivirus, Outbox)

**Fecha target:** 2026-11-30

**Requisitos:** Todos deben ser ✅

| ID | Criterio | Herramienta | Pass/Fail |
|---|---|---|---|
| **G-UPLOAD-MULTIPART** | Carga multipart funcionando | Supertest | ✅ 100% tests pass |
| **G-QUARANTINE** | Archivos en cuarentena antes de verificación | Integration | ✅ File state = quarantined |
| **G-ANTIVIRUS** | Scan antivirus mock OK | Supertest | ✅ scan_result=clean |
| **G-HASH-INTEGRITY** | SHA-256 hash calculado, verificado | Integration | ✅ match stored hash |
| **G-NO-DUPLICATES** | Idempotencia en carga (reintentos) | Integration | ✅ 1 archivo por upload_id |
| **G-OUTBOX-PUBLISH** | Eventos en outbox, publicados a bus | Integration | ✅ All events queued |
| **G-INBOX-CONSUME** | Consumidores reciben eventos correctamente | Integration | ✅ Event consumed, state updated |
| **G-OCR-ASYNC** | OCR asíncrono (mock) sin bloquear | Integration | ✅ Response inmediata, OCR en background |
| **G-AUDIT-TRAIL** | Toda operación auditada (upload, scan, OCR) | Integration | ✅ audit_logs >= 5 por operación |
| **G-FILE-PERMISSIONS** | Archivo solo legible con permisos (S3 presigned URL) | E2E | ✅ URLs expiran, autorizadas |
| **G-LARGE-FILES** | Archivos >50MB manejados (streaming) | k6 load test | ✅ <5GB file success |
| **G-PERFORMANCE-UPLOADS** | Upload 100 archivos concurrentes/segundo | k6 load test | ✅ p95 latency <3s |
| **G-SECURITY-SCAN** | ZAP scan (file upload) críticos=0 | OWASP ZAP | ✅ 0 críticos, malware detection |

**Go/No-Go Decision:** Todos ✅ → MVP desarrollo autorizado

---

## 8. Herramientas y configuración

### Vitest (Unit)
```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80,
    },
  },
});
```

### Testcontainers (Integration)
```typescript
// Base class para tests
abstract class DatabaseTestCase {
  protected container: PostgreSqlContainer;
  protected db: pg.Pool;

  async setup() {
    this.container = await new PostgreSqlContainer()
      .withDatabase('test_sgd')
      .start();
    this.db = new pg.Pool({ /* config */ });
    await runMigrations(this.db);
    await enableRLSPolicies(this.db);
  }

  async teardown() {
    await this.container.stop();
  }
}
```

### k6 (Load Testing)
```javascript
// tests/load/radicacion-load.js
import http from 'k6/http';

export const options = {
  vus: 100,
  duration: '1m',
  thresholds: {
    http_req_duration: ['p(95)<3000', 'p(99)<5000'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const payload = {
    subject: `Radicación ${__VU}-${__ITER}`,
    sender_name: 'Test Sender',
  };
  http.post('http://localhost:3000/api/v1/correspondences/incoming', payload);
}
```

---

## 9. Métricas y reportes

**Reporte post-test:** HTML + JSON

- Cobertura código (%)
- Test pass rate (%)
- Performance (p95, p99 latencias)
- Seguridad (ZAP risk count)
- Auditoría (eventos logged)

**Frecuencia:** 
- Unit: Cada commit (CI)
- Integration: Cada PR (CI)
- E2E: Daily nightly
- Security: Semanalmente + pre-POC

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-08-05 | Plan testing layers, criterios gate POC-001/002, herramientas (Vitest, Testcontainers, Playwright, ZAP, k6). | David Ernesto Antequera Martínez |
