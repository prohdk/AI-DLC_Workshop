# Unit of Work — 의존성 매트릭스

## Unit 간 의존성

| Unit | 의존 대상 | 의존 유형 | 설명 |
|---|---|---|---|
| **Backend** | PostgreSQL | 런타임 | DB 연결 필수 |
| **Frontend** | Backend | 런타임 | REST API + SSE 통신 |
| **Frontend** | — | 빌드 타임 | 독립 빌드 가능 (API mock 가능) |

## 개발 순서 의존성

```
+-------------+     +-------------+     +-------------+
| PostgreSQL  | --> |  Backend    | --> |  Frontend   |
| (DB)        |     |  (Unit 1)   |     |  (Unit 2)   |
+-------------+     +-------------+     +-------------+
     선행 조건          1st 개발           2nd 개발
```

- **Backend**는 PostgreSQL 스키마가 정의되어야 개발 가능 (DB 스키마는 Backend Unit에 포함)
- **Frontend**는 Backend API가 완성되어야 통합 테스트 가능 (개발 중 mock 사용 가능)

## Construction Phase 실행 순서

```
Unit 1: Backend
  ├── Functional Design (상세)
  └── Code Generation

Unit 2: Frontend
  ├── Functional Design (상세)
  └── Code Generation

Build and Test (전체 통합)
```

## 통신 인터페이스

| From | To | Protocol | Endpoints |
|---|---|---|---|
| Frontend | Backend | HTTP (REST) | /api/auth/*, /api/menu/*, /api/orders/*, /api/tables/* |
| Frontend | Backend | SSE | /api/sse/orders |
| Backend | PostgreSQL | TCP | port 5432 |

## 공유 계약 (Shared Contracts)

| 계약 | 소유자 | 소비자 | 형식 |
|---|---|---|---|
| REST API 스키마 | Backend (Pydantic) | Frontend (TypeScript types) | JSON |
| SSE 이벤트 형식 | Backend (SSEService) | Frontend (useSSE hook) | EventSource |
| JWT 토큰 구조 | Backend (auth) | Frontend (AuthContext) | Bearer token |
