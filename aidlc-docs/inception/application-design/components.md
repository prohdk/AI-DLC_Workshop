# Components

## Backend Components (Python + FastAPI)

### 1. auth 모듈
- **목적**: 관리자 인증 및 테이블 태블릿 인증 처리
- **책임**:
  - 관리자 로그인 (매장 식별자 + 사용자명 + 비밀번호)
  - 테이블 태블릿 로그인 (매장 식별자 + 테이블 번호 + 비밀번호)
  - JWT 토큰 발급 및 검증
  - 로그인 시도 제한
- **인터페이스**: REST API (`/api/auth/*`)

### 2. menu 모듈
- **목적**: 메뉴 및 카테고리 CRUD 관리
- **책임**:
  - 카테고리 CRUD
  - 메뉴 항목 CRUD
  - 메뉴 노출 순서 조정
  - 필수 필드 및 가격 범위 검증
- **인터페이스**: REST API (`/api/menu/*`)

### 3. order 모듈
- **목적**: 주문 생성, 조회, 상태 관리
- **책임**:
  - 주문 생성 (장바구니 → 주문 전환)
  - 주문 조회 (현재 세션 주문)
  - 주문 상태 변경 (상태 머신: 대기중→준비중→완료)
  - 주문 삭제 (관리자 직권)
  - SSE 이벤트 발행
- **인터페이스**: REST API (`/api/orders/*`)

### 4. table 모듈
- **목적**: 테이블 및 세션 라이프사이클 관리
- **책임**:
  - 테이블 초기 설정 (번호, 비밀번호)
  - 테이블 세션 시작/종료
  - 이용 완료 처리 (주문 이력 이동, 리셋)
  - 과거 주문 내역 조회
- **인터페이스**: REST API (`/api/tables/*`)

### 5. sse 모듈
- **목적**: Server-Sent Events 실시간 통신 관리
- **책임**:
  - SSE 연결 관리 (다중 관리자 세션)
  - 이벤트 타입별 브로드캐스트 (new_order, order_status_changed, order_deleted, session_completed)
  - 연결 해제 처리
- **인터페이스**: SSE 엔드포인트 (`/api/sse/orders`)

### 6. database 모듈
- **목적**: 데이터베이스 연결 및 모델 정의
- **책임**:
  - SQLAlchemy 엔진/세션 관리
  - ORM 모델 정의 (Store, Admin, Table, TableSession, Category, MenuItem, Order, OrderItem, OrderHistory)
  - 시드 데이터 초기화

---

## Frontend Components (React + TypeScript)

### 7. CustomerApp
- **목적**: 고객용 주문 인터페이스
- **책임**:
  - 테이블 자동 로그인 화면
  - 메뉴 조회 (카테고리별 카드 레이아웃)
  - 장바구니 관리 (로컬 저장)
  - 주문 생성 및 확인
  - 주문 내역 조회 (현재 세션)
- **라우팅**: `/customer/*`

### 8. AdminApp
- **목적**: 관리자용 매장 관리 인터페이스
- **책임**:
  - 관리자 로그인
  - 실시간 주문 모니터링 대시보드 (SSE)
  - 테이블 관리 (설정, 주문 삭제, 이용 완료, 과거 내역)
  - 메뉴 관리 (CRUD)
- **라우팅**: `/admin/*`

### 9. Shared Components
- **목적**: 고객/관리자 앱 공유 컴포넌트
- **책임**:
  - API 클라이언트 (Axios 인스턴스, 인터셉터)
  - 인증 Context (토큰 관리)
  - i18n 설정 (react-i18next, ko/en JSON)
  - 공통 UI 컴포넌트 (Button, Modal, Loading 등)
