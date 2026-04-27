# Component Dependencies

## Backend Dependency Matrix

| Component | 의존 대상 | 통신 방식 |
|---|---|---|
| auth | database | 직접 호출 (SQLAlchemy) |
| menu | database | 직접 호출 (SQLAlchemy) |
| order | database, sse | 직접 호출 (SQLAlchemy), 이벤트 발행 |
| table | database, sse | 직접 호출 (SQLAlchemy), 이벤트 발행 |
| sse | - | 인메모리 연결 관리 |
| database | - | PostgreSQL 연결 |

## Frontend Dependency Matrix

| Component | 의존 대상 | 통신 방식 |
|---|---|---|
| CustomerApp | Shared (API, Auth Context, i18n) | Context, Import |
| AdminApp | Shared (API, Auth Context, i18n, SSE Hook) | Context, Import |
| Shared | Backend API | HTTP (Axios), SSE |

## Data Flow

```
+--------------------------------------------------+
|                   Frontend                        |
|                                                   |
|  +------------------+    +--------------------+   |
|  |   CustomerApp    |    |     AdminApp       |   |
|  |                  |    |                    |   |
|  | MenuPage         |    | DashboardPage     |   |
|  | CartDrawer       |    | TableManagement   |   |
|  | OrderConfirm     |    | MenuManagement    |   |
|  | OrderHistory     |    | OrderDetailModal  |   |
|  +--------+---------+    +--------+-----------+   |
|           |                       |               |
|  +--------+-----------------------+-----------+   |
|  |          Shared Layer                      |   |
|  | API Client (Axios) | Auth Context | i18n   |   |
|  +--------------------+------+----------------+   |
+--------------------------|------------------------+
                           | HTTP / SSE
+--------------------------|------------------------+
|                   Backend (FastAPI)                |
|                                                   |
|  +-------+  +------+  +-------+  +-------+       |
|  | auth  |  | menu |  | order |  | table |       |
|  +---+---+  +--+---+  +---+---+  +---+---+       |
|      |         |           |          |           |
|      |         |     +-----+----+     |           |
|      |         |     |   sse    |     |           |
|      |         |     +----------+     |           |
|      |         |           |          |           |
|  +---+---------+-----------+----------+---+       |
|  |           database (SQLAlchemy)        |       |
|  +--------------------+------------------+        |
+--------------------------|------------------------+
                           |
                    +------+------+
                    | PostgreSQL  |
                    +-------------+
```

## 통신 패턴

### REST API (HTTP)
- 고객 → Backend: 메뉴 조회, 주문 생성, 주문 내역 조회
- 관리자 → Backend: 인증, 주문 상태 변경, 테이블 관리, 메뉴 관리

### SSE (Server → Client)
- Backend → 관리자: 실시간 주문 이벤트 (new_order, order_status_changed, order_deleted, session_completed)
- 다중 관리자 세션 동시 지원

### 이벤트 발행 흐름
1. 고객이 주문 생성 → OrderService → SSEService.publish(`new_order`)
2. 관리자가 상태 변경 → OrderService → SSEService.publish(`order_status_changed`)
3. 관리자가 주문 삭제 → OrderService → SSEService.publish(`order_deleted`)
4. 관리자가 이용 완료 → TableService → SSEService.publish(`session_completed`)
