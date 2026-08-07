# TypeScript Interfaces — POC-001

| Campo | Valor |
|---|---|
| Código | GDP-BKD-002 |
| Versión | 1.0 |
| Estado | Aprobado (Fase 4-A2) |
| Fecha | 2026-08-05 |
| Propietario | Antonio José Escrucería Uribe (Arquitecto) |
| Formato | TypeScript interfaces (libs/shared-types) |
| Aplicable | Todos los 6 macroservicios POC-001 |

---

## Propósito

Definiciones TypeScript type-safe para entidades, DTOs, eventos y respuestas. Compartidas entre frontend y backend.

---

## 1. Entidades de dominio (Domain Layer)

```typescript
// libs/shared-types/src/domain/index.ts

export type TenantId = string & { readonly __brand: 'TenantId' };
export type UserId = string & { readonly __brand: 'UserId' };
export type DocumentId = string & { readonly __brand: 'DocumentId' };
export type CorrespondenceId = string & { readonly __brand: 'CorrespondenceId' };

export interface Organization {
  id: string;
  tenant_id: TenantId;
  name: string;
  sector?: string;
  enabled: boolean;
  created_at: Date;
  created_by?: UserId;
}

export interface User {
  id: UserId;
  tenant_id: TenantId;
  keycloak_id?: string;
  email: string;
  full_name: string;
  document_id?: string;
  phone?: string;
  department_id?: string;
  enabled: boolean;
  last_login?: Date;
  created_at: Date;
}

export interface Role {
  id: string;
  tenant_id: TenantId;
  code: string;
  name: string;
  description?: string;
}

export interface Document {
  id: DocumentId;
  tenant_id: TenantId;
  series_id: string;
  document_type_id?: string;
  title: string;
  description?: string;
  created_by: UserId;
  created_at: Date;
  status: 'draft' | 'active' | 'archived' | 'disposed';
  classification: 'public' | 'internal' | 'confidential' | 'secret';
  expires_at?: Date;
}

export interface Correspondence {
  id: CorrespondenceId;
  tenant_id: TenantId;
  correspondence_type: 'incoming' | 'outgoing' | 'internal';
  number: string;  // RAD-2026-00001
  document_id: DocumentId;
  subject: string;
  sender_name?: string;
  sender_email?: string;
  status: 'registered' | 'in_review' | 'approved' | 'sent' | 'archived';
  priority: 'normal' | 'high' | 'urgent';
  created_at: Date;
  created_by: UserId;
}

export interface Expedient {
  id: string;
  tenant_id: TenantId;
  code: string;
  title: string;
  series_id: string;
  status: 'open' | 'closed' | 'disposed';
  created_at: Date;
  created_by: UserId;
}
```

---

## 2. DTOs — Request/Response

```typescript
// libs/shared-types/src/dtos/index.ts

// ===== IAM DTOs (MS-01) =====

export interface CreateOrganizationDto {
  name: string;
  sector?: string;
  headquarters: {
    name: string;
    city?: string;
    address?: string;
  };
}

export interface OrganizationResponseDto {
  id: string;
  tenant_id: TenantId;
  name: string;
  created_at: Date;
}

export interface CreateUserDto {
  email: string;
  full_name: string;
  department_id: string;
  roles?: string[];  // role codes
}

export interface UserResponseDto {
  id: UserId;
  email: string;
  full_name: string;
  status: 'invited' | 'active' | 'inactive';
  created_at: Date;
}

export interface LinkIdentityDto {
  keycloak_id: string;
}

export interface SwitchTenantDto {
  tenant_id: TenantId;
}

export interface SwitchTenantResponseDto {
  tenant_id: TenantId;
  tenant_name: string;
  effective_permissions: string[];
  switched_at: Date;
}

// ===== Document Core DTOs (MS-02) =====

export interface CreateSeriesDto {
  code: string;
  name: string;
  description?: string;
  retention_years: number;
  requires_approval?: boolean;
}

export interface SeriesResponseDto {
  id: string;
  code: string;
  name: string;
  created_at: Date;
}

export interface CreateDocumentDto {
  title: string;
  description?: string;
  series_id: string;
  document_type_id?: string;
  classification?: 'public' | 'internal' | 'confidential' | 'secret';
  expedient_id?: string;
}

export interface DocumentResponseDto {
  id: DocumentId;
  title: string;
  status: string;
  classification: string;
  created_at: Date;
  created_by: UserId;
}

export interface SearchDocumentsDto {
  q: string;  // query text
  series_id?: string;
  classification?: string;
  from_date?: Date;
  to_date?: Date;
  limit?: number;
  offset?: number;
}

export interface SearchResultDto {
  id: DocumentId;
  title: string;
  series: string;
  classification: string;
  created_at: Date;
  relevance_score: number;
}

export interface SearchResponseDto {
  total: number;
  results: SearchResultDto[];
}

// ===== Correspondence DTOs (MS-03) =====

export interface CreateCorrespondenceDto {
  subject: string;
  sender_name?: string;
  sender_email?: string;
  document_id: DocumentId;
  received_date: Date;
  priority?: 'normal' | 'high' | 'urgent';
  assigned_to?: UserId;
}

export interface CorrespondenceResponseDto {
  id: CorrespondenceId;
  number: string;
  document_id: DocumentId;
  status: string;
  created_at: Date;
  receipt_proof: {
    number: string;
    timestamp: Date;
    receipt_url: string;
  };
}
```

---

## 3. Eventos (Domain Events)

```typescript
// libs/shared-types/src/events/index.ts

export interface DomainEvent {
  type: string;
  aggregateId: string;
  tenant_id: TenantId;
  timestamp: Date;
  trace_id?: string;
}

// ===== IAM Events =====

export interface OrganizationCreatedEvent extends DomainEvent {
  type: 'OrganizationCreated';
  data: {
    name: string;
    sector?: string;
  };
}

export interface UserInvitedEvent extends DomainEvent {
  type: 'UserInvited';
  aggregateId: UserId;
  data: {
    email: string;
    full_name: string;
    department_id: string;
  };
}

export interface IdentityLinkedEvent extends DomainEvent {
  type: 'IdentityLinked';
  aggregateId: UserId;
  data: {
    keycloak_id: string;
    linked_at: Date;
  };
}

export interface TenantContextSwitchedEvent extends DomainEvent {
  type: 'TenantContextSwitched';
  aggregateId: UserId;
  data: {
    from_tenant: TenantId;
    to_tenant: TenantId;
    switched_at: Date;
  };
}

// ===== Document Events =====

export interface DocumentCreatedEvent extends DomainEvent {
  type: 'DocumentCreated';
  aggregateId: DocumentId;
  data: {
    title: string;
    series_id: string;
    classification: string;
    created_by: UserId;
  };
}

export interface DocumentSearchedEvent extends DomainEvent {
  type: 'DocumentSearched';
  data: {
    query: string;
    result_count: number;
    search_by: UserId;
  };
}

// ===== Correspondence Events =====

export interface CorrespondenceRegisteredEvent extends DomainEvent {
  type: 'CorrespondenceRegistered';
  aggregateId: CorrespondenceId;
  data: {
    number: string;
    subject: string;
    correspondence_type: 'incoming' | 'outgoing' | 'internal';
    document_id: DocumentId;
  };
}

// ===== Audit Events =====

export interface AuditLogCreatedEvent extends DomainEvent {
  type: 'AuditLogCreated';
  data: {
    event_type: string;
    entity_type: string;
    entity_id: string;
    action: string;
    performed_by: UserId;
  };
}

export type AllDomainEvents = 
  | OrganizationCreatedEvent
  | UserInvitedEvent
  | IdentityLinkedEvent
  | TenantContextSwitchedEvent
  | DocumentCreatedEvent
  | DocumentSearchedEvent
  | CorrespondenceRegisteredEvent
  | AuditLogCreatedEvent;
```

---

## 4. Error Responses (RFC 9457)

```typescript
// libs/shared-types/src/errors/index.ts

export interface ProblemDetail {
  type: string;  // URI
  status: number;
  title: string;
  detail: string;
  instance: string;  // request URI
  timestamp: Date;
  trace_id?: string;
  fields?: Array<{
    field: string;
    message: string;
  }>;
}

export const ErrorTypes = {
  VALIDATION_ERROR: 'https://api.example.com/errors/validation-error',
  UNAUTHORIZED: 'https://api.example.com/errors/unauthorized',
  FORBIDDEN: 'https://api.example.com/errors/forbidden',
  NOT_FOUND: 'https://api.example.com/errors/not-found',
  CONFLICT: 'https://api.example.com/errors/conflict',
  DOMAIN_ERROR: 'https://api.example.com/errors/domain-error',
  INTERNAL_ERROR: 'https://api.example.com/errors/internal-error',
} as const;
```

---

## 5. Audit Log Payload

```typescript
// libs/shared-types/src/audit/index.ts

export interface AuditLogPayload {
  event_type: 'create' | 'read' | 'update' | 'delete' | 'approve' | 'sign';
  entity_type: 'document' | 'correspondence' | 'expedient' | 'user' | 'organization';
  entity_id: string;
  performed_by: UserId;
  performed_at: Date;
  ip_address?: string;
  user_agent?: string;
  action: string;  // Descripción legible
  old_value?: Record<string, any>;
  new_value?: Record<string, any>;
  status: 'success' | 'failure';
  error_message?: string;
  trace_id: string;  // Para correlacionar con logs/eventos
}
```

---

## 6. Currented Tenant (Context)

```typescript
// libs/shared-types/src/context/index.ts

export interface CurrentTenant {
  id: TenantId;
  name: string;
  sector?: string;
}

export interface CurrentUser {
  id: UserId;
  email: string;
  full_name: string;
  roles: string[];
  permissions: string[];
}

export interface RequestContext {
  tenant: CurrentTenant;
  user: CurrentUser;
  correlationId: string;  // trace_id
  timestamp: Date;
}
```

---

## 7. Convención de uso

```typescript
// En controladores (MS-01 example)

import { Controller, Post, Body } from '@nestjs/common';
import { CreateOrganizationDto, OrganizationResponseDto } from '@lib/types';
import { OrganizationService } from '../application/services';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly service: OrganizationService) {}

  @Post()
  async create(@Body() dto: CreateOrganizationDto): Promise<OrganizationResponseDto> {
    return this.service.create(dto);
  }
}

// En servicios

async create(dto: CreateOrganizationDto): Promise<OrganizationResponseDto> {
  // Validar (NestJS ValidationPipe usa DTOs)
  if (!dto.name) throw new BadRequestException('name required');
  
  // Crear dominio
  const org = new Organization({
    id: generateUUID(),
    tenant_id: generateUUID() as TenantId,
    name: dto.name,
    sector: dto.sector,
  });
  
  // Persistir
  await this.repo.save(org);
  
  // Publicar evento
  await this.eventService.publish({
    type: 'OrganizationCreated',
    aggregateId: org.id,
    tenant_id: org.tenant_id,
    timestamp: new Date(),
    data: { name: org.name, sector: org.sector },
  });
  
  // Responder
  return {
    id: org.id,
    tenant_id: org.tenant_id,
    name: org.name,
    created_at: org.created_at,
  };
}
```

---

## Historial

| Versión | Fecha | Cambio | Autor |
|---|---|---|---|
| 1.0 | 2026-08-05 | Interfaces entities, DTOs, events, errors, audit, context. Type-safe end-to-end. | Antonio José Escrucería Uribe |
