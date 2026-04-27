# Services

## Backend Service Layer

각 도메인 모듈 내에 service 파일이 위치하며, 비즈니스 로직을 담당합니다.

### AuthService (`auth/service.py`)
- **책임**: 인증/인가 비즈니스 로직
- **오케스트레이션**:
  - 관리자 로그인: 자격 증명 검증 → 로그인 시도 제한 확인 → JWT 발급
  - 테이블 로그인: 테이블 자격 증명 검증 → JWT 발급
- **의존성**: database 모듈 (Admin, Table 모델)

### MenuService (`menu/service.py`)
- **책임**: 메뉴/카테고리 비즈니스 로직
- **오케스트레이션**:
  - 메뉴 등록: 필수 필드 검증 → 가격 범위 검증 → DB 저장
  - 메뉴 순서 변경: 순서 값 업데이트 → 재정렬
- **의존성**: database 모듈 (Category, MenuItem 모델)

### OrderService (`order/service.py`)
- **책임**: 주문 생성, 상태 관리, 삭제
- **오케스트레이션**:
  - 주문 생성: 메뉴 유효성 확인 → 주문 저장 → SSE 이벤트 발행 (`new_order`)
  - 상태 변경: 상태 머신 전이 검증 → 상태 업데이트 → SSE 이벤트 발행 (`order_status_changed`)
  - 주문 삭제: 주문 삭제 → 총 주문액 재계산 → SSE 이벤트 발행 (`order_deleted`)
- **의존성**: database 모듈, sse 모듈

### TableService (`table/service.py`)
- **책임**: 테이블 설정, 세션 관리, 이력 처리
- **오케스트레이션**:
  - 테이블 설정: 테이블 번호/비밀번호 저장 → 세션 생성
  - 이용 완료: 활성 주문 → OrderHistory 복사 → 원본 삭제 → 세션 종료 → SSE 이벤트 발행 (`session_completed`)
  - 과거 내역 조회: OrderHistory 테이블에서 날짜 필터링 조회
- **의존성**: database 모듈, sse 모듈

### SSEService (`sse/service.py`)
- **책임**: SSE 연결 관리 및 이벤트 브로드캐스트
- **오케스트레이션**:
  - 구독: 연결 등록 → EventSourceResponse 반환
  - 이벤트 발행: 모든 활성 연결에 이벤트 타입별 브로드캐스트
  - 연결 해제: 비활성 연결 정리
- **의존성**: 없음 (인메모리 연결 관리)

---

## Frontend Service Layer

### API Client (`shared/api/client.ts`)
- **책임**: Axios 인스턴스 설정 및 공통 인터셉터
- **기능**:
  - Base URL 설정
  - JWT 토큰 자동 첨부 (요청 인터셉터)
  - 401 응답 시 자동 로그아웃 (응답 인터셉터)
  - 에러 핸들링

### Domain API Modules
- `shared/api/auth.ts`: 로그인 API 호출
- `shared/api/menu.ts`: 메뉴/카테고리 API 호출
- `shared/api/orders.ts`: 주문 API 호출
- `shared/api/tables.ts`: 테이블 API 호출
