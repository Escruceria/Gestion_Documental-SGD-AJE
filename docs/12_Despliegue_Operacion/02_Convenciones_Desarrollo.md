# Convenciones de Desarrollo — SGD

| Campo | Valor |
|---|---|
| Código | GDP-DEP-002 |
| Versión | 1.0 |
| Estado | Aprobado (Fase 4-A1) |
| Fecha | 2026-08-05 |
| Propietario | Antonio José Escrucería Uribe (Arquitecto) |
| Revisores | David Ernesto Antequera Martínez (Operaciones), Neffer Anais Martínez (QA) |

## Propósito

Guía de convenciones para código, tests, commits, PRs y documentación. Garantiza coherencia a través de 6 macroservicios, frontend y libs.

---

## 1. Estructura por capas (Hexagonal Architecture)

Cada macroservicio sigue **Ports & Adapters**:

```
src/
├── interfaces/              # INPUT: HTTP controllers, event listeners
├── application/             # Orquestación: servicios, DTOs, validación
├── domain/                  # CORE: entidades, agregados, reglas negocio
└── infrastructure/          # OUTPUT: BD, cache, integraciones externas
```

**Dependencias:**
- Domain → nadie (puro)
- Application → Domain
- Infrastructure → Domain, Application
- Interfaces → Application (no Domain directo)

---

## 2. Ejemplos de código

### Entidad de dominio

```typescript
// src/domain/entities/document.entity.ts

import { Aggregate } from '@lib/domain';

export interface DocumentProps {
  id: string;
  tenant_id: string;
  title: string;
  series_id: string;
  classification: 'public' | 'internal' | 'confidential' | 'secret';
  created_at: Date;
  status: 'draft' | 'active' | 'archived';
}

export class Document implements Aggregate {
  private props: DocumentProps;

  constructor(props: DocumentProps) {
    this.validate(props);
    this.props = props;
  }

  private validate(props: DocumentProps): void {
    if (!props.title || props.title.length < 3) {
      throw new InvalidDocumentError('title must be >= 3 chars');
    }
    if (!props.tenant_id) {
      throw new InvalidDocumentError('tenant_id is required');
    }
  }

  get id(): string { return this.props.id; }
  get title(): string { return this.props.title; }
  get status(): string { return this.props.status; }

  // Métodos de negocio
  archive(): void {
    if (this.props.status !== 'active') {
      throw new DocumentNotActiveError();
    }
    this.props.status = 'archived';
  }
}
```

### Servicio aplicación

```typescript
// src/application/services/document.service.ts

import { Injectable } from '@nestjs/common';
import { CreateDocumentDto, UpdateDocumentDto } from '../dtos';
import { DocumentRepository } from '@lib/domain';
import { Document } from '@lib/domain';
import { AuditService } from './audit.service';

@Injectable()
export class DocumentService {
  constructor(
    private readonly repo: DocumentRepository,
    private readonly auditService: AuditService,
    private readonly currentTenant: CurrentTenantService,
  ) {}

  async create(dto: CreateDocumentDto): Promise<Document> {
    // Validar
    if (!dto.title) throw new ValidationError('title required');

    // Crear entidad (dominio)
    const doc = new Document({
      id: generateUUID(),
      tenant_id: this.currentTenant.id,
      title: dto.title,
      series_id: dto.series_id,
      classification: dto.classification || 'internal',
      created_at: new Date(),
      status: 'draft',
    });

    // Persistir
    await this.repo.save(doc);

    // Auditar
    await this.auditService.log({
      entity_type: 'document',
      entity_id: doc.id,
      action: 'create',
      new_value: { title: doc.title },
    });

    return doc;
  }

  async findById(id: string): Promise<Document | null> {
    return this.repo.findById(id, this.currentTenant.id);
  }
}
```

### DTO y validación

```typescript
// src/application/dtos/create-document.dto.ts

import { IsString, MinLength, IsUUID, IsEnum } from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsUUID()
  series_id: string;

  @IsEnum(['public', 'internal', 'confidential', 'secret'])
  classification?: string;
}
```

### Controller

```typescript
// src/interfaces/http/documents.controller.ts

import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { DocumentService } from '@app/document/application/services';
import { CreateDocumentDto } from '@app/document/application/dtos';
import { CurrentTenant } from '@lib/middleware';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly service: DocumentService) {}

  @Post()
  async create(@Body() dto: CreateDocumentDto) {
    const doc = await this.service.create(dto);
    return {
      id: doc.id,
      title: doc.title,
      status: doc.status,
      created_at: doc.created_at,
    };
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    const doc = await this.service.findById(id);
    if (!doc) throw new NotFoundException();
    return doc;
  }
}
```

### Test unitario

```typescript
// src/__tests__/unit/document.entity.spec.ts

import { describe, it, expect } from 'vitest';
import { Document } from '@app/document/domain/entities';
import { InvalidDocumentError } from '@app/document/domain/exceptions';

describe('Document Entity', () => {
  it('should create valid document', () => {
    const doc = new Document({
      id: 'doc-001',
      tenant_id: 'tenant-001',
      title: 'Test Document',
      series_id: 'series-001',
      classification: 'internal',
      created_at: new Date(),
      status: 'draft',
    });

    expect(doc.id).toBe('doc-001');
    expect(doc.title).toBe('Test Document');
  });

  it('should reject title < 3 chars', () => {
    expect(() => new Document({
      // ...
      title: 'ab', // Inválido
    })).toThrow(InvalidDocumentError);
  });

  it('should archive only active documents', () => {
    const doc = new Document({ /* ... status: 'active' */ });
    doc.archive();
    expect(doc.status).toBe('archived');
  });
});
```

### Test integración

```typescript
// src/__tests__/integration/document.service.spec.ts

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Test } from '@nestjs/testing';
import { PostgreSqlContainer } from '@testcontainers/postgresql';
import { DocumentService } from '@app/document/application/services';

describe('DocumentService Integration', () => {
  let service: DocumentService;
  let postgres: PostgreSqlContainer;

  beforeAll(async () => {
    postgres = new PostgreSqlContainer().withDatabase('test_sgd').start();
    
    const module = await Test.createTestingModule({
      providers: [DocumentService],
    }).compile();

    service = module.get(DocumentService);
  });

  it('should persist and retrieve document', async () => {
    const created = await service.create({
      title: 'Integration Test Doc',
      series_id: 'series-001',
    });

    const retrieved = await service.findById(created.id);
    expect(retrieved?.title).toBe('Integration Test Doc');
  });

  afterAll(async () => {
    await postgres.stop();
  });
});
```

---

## 3. Errores y excepciones

```typescript
// src/domain/exceptions/

// Base
export abstract class DomainException extends Error {
  abstract readonly code: string;
}

// Específicas
export class InvalidDocumentError extends DomainException {
  code = 'INVALID_DOCUMENT';
  constructor(message: string) {
    super(`Invalid document: ${message}`);
  }
}

export class DocumentNotFoundError extends DomainException {
  code = 'DOCUMENT_NOT_FOUND';
  constructor(id: string) {
    super(`Document ${id} not found`);
  }
}

// Global filter convierte DomainException → RFC 9457
@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    response.status(422).json({
      type: 'https://api.example.com/errors/domain-error',
      status: 422,
      title: 'Business Rule Violation',
      detail: exception.message,
      instance: exception.code,
      timestamp: new Date().toISOString(),
    });
  }
}
```

---

## 4. Modelos de datos multitenant

### Todas las tablas con tenant_id

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,  -- OBLIGATORIO
  title TEXT NOT NULL,
  series_id UUID NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID NOT NULL,
  -- ...
  CONSTRAINT fk_tenant FOREIGN KEY (tenant_id) REFERENCES organizations(id)
);

-- Índice compuesto para RLS
CREATE INDEX idx_documents_tenant_id 
  ON documents(tenant_id, id);

-- RLS Policy
CREATE POLICY documents_tenant_rls 
  ON documents
  USING (tenant_id = CURRENT_SETTING('app.current_tenant_id')::UUID);
```

### Middleware establece contexto

```typescript
// libs/shared-middleware/src/tenant/set-tenant.middleware.ts

@Injectable()
export class SetTenantMiddleware implements NestMiddleware {
  constructor(private db: Database) {}

  async use(req: any, res: any, next: any) {
    const tenantId = req.user?.tenant_id;
    if (!tenantId) throw new UnauthorizedException('No tenant in token');

    // RLS: establecer contexto para sesión BD
    await this.db.query("SET app.current_tenant_id = $1", [tenantId]);
    next();
  }
}
```

---

## 5. Eventos y comandos

### Event schema

```typescript
// libs/shared-types/src/events/document.events.ts

export type DocumentCreatedEvent = {
  type: 'DocumentCreated';
  aggregateId: string;
  tenant_id: string;
  data: {
    title: string;
    series_id: string;
    classification: string;
    created_by: string;
  };
  timestamp: Date;
};

export type DocumentArchivedEvent = {
  type: 'DocumentArchived';
  aggregateId: string;
  tenant_id: string;
  data: { archived_by: string };
  timestamp: Date;
};
```

### Publicar evento (Outbox)

```typescript
// src/application/services/document.service.ts

async create(dto: CreateDocumentDto): Promise<Document> {
  const doc = new Document({ /* ... */ });
  await this.repo.save(doc);

  // Outbox (se consume asincronamente)
  await this.outboxService.append({
    type: 'DocumentCreated',
    aggregateId: doc.id,
    tenant_id: this.currentTenant.id,
    data: { title: doc.title, series_id: doc.series_id },
    timestamp: new Date(),
  });

  return doc;
}
```

### Consumir evento (Inbox)

```typescript
// MS-05: audit-compliance-service
// src/infrastructure/event-listeners/document-created.listener.ts

@EventPattern('DocumentCreated')
async handleDocumentCreated(event: DocumentCreatedEvent) {
  // Validar idempotencia
  const existing = await this.inboxService.findByKey(event.aggregateId);
  if (existing) return; // Ya procesado

  // Registrar auditoría
  await this.auditService.log({
    entity_type: 'document',
    entity_id: event.aggregateId,
    action: 'created',
    new_value: event.data,
  });

  // Marcar como procesado
  await this.inboxService.markProcessed(event.aggregateId);
}
```

---

## 6. Logging y observabilidad

```typescript
// Usar OpenTelemetry en contexto request

import { Logger } from '@nestjs/common';
import { trace, context } from '@opentelemetry/api';

const tracer = trace.getTracer('document-service');

async create(dto): Promise<Document> {
  const span = tracer.startSpan('DocumentService.create');
  
  return context.with(trace.setSpan(context.active(), span), async () => {
    try {
      const doc = new Document({ /* ... */ });
      span.setAttributes({
        'document.id': doc.id,
        'document.title': doc.title,
        'tenant_id': this.currentTenant.id,
      });
      
      await this.repo.save(doc);
      span.setStatus({ code: 0 }); // OK
      return doc;
    } catch (error) {
      span.recordException(error);
      span.setStatus({ code: 2, message: error.message });
      throw error;
    } finally {
      span.end();
    }
  });
}
```

---

## 7. Formato Pull Request

```markdown
## Descripción
Breve descripción del cambio.

## Tipo de cambio
- [ ] Feature
- [ ] Bugfix
- [ ] Refactor
- [ ] Tests
- [ ] Docs

## Tests
- [ ] Unit tests added
- [ ] Integration tests added
- [ ] E2E tests added

## Checklist
- [ ] Code sigue convenciones (eslint, prettier)
- [ ] Documentación actualizada
- [ ] Cambios de BD documentados
- [ ] No hay secrets en código
- [ ] RLS policy validado (si aplica)

## Notas
Cualquier nota adicional.
```

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-08-05 | Convenciones código, capas, ejemplos, errores, eventos, logging, PRs. | Antonio José Escrucería Uribe |
