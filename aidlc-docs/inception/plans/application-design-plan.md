# Application Design Plan

## 설계 계획

요구사항 분석 결과를 기반으로 다음 설계 산출물을 생성합니다.

### 설계 단계
- [x] 컴포넌트 식별 및 책임 정의 (components.md)
- [x] 컴포넌트 메서드 시그니처 정의 (component-methods.md)
- [x] 서비스 레이어 정의 (services.md)
- [x] 컴포넌트 의존성 관계 정의 (component-dependency.md)
- [x] 통합 설계 문서 생성 (application-design.md)
- [x] 설계 완전성 및 일관성 검증

---

## 설계 질문

아래 질문에 `[Answer]:` 태그 뒤에 선택지 알파벳을 입력해 주세요.

### 컴포넌트 구조

## Question 1
백엔드 API 구조를 어떻게 구성하시겠습니까?

A) 기능별 모듈 분리 (auth/, menu/, order/, table/ 등 도메인별 디렉토리)
B) 레이어별 분리 (routes/, services/, repositories/ 등 계층별 디렉토리)
C) 기능별 + 레이어별 혼합 (도메인별 디렉토리 내에 각 레이어 파일)
X) Other (please describe after [Answer]: tag below)

[Answer]: A) 기능별 모듈 분리 (auth/, menu/, order/, table/ 등 도메인별 디렉토리)

## Question 2
프론트엔드 상태 관리 방식은 어떻게 하시겠습니까?

A) React Context API (가벼운 상태 관리, 추가 라이브러리 없음)
B) Zustand (경량 상태 관리 라이브러리)
C) Redux Toolkit (풍부한 기능, 미들웨어 지원)
X) Other (please describe after [Answer]: tag below)

[Answer]: A) React Context API (가벼운 상태 관리, 추가 라이브러리 없음)

## Question 3
고객용 앱과 관리자용 앱을 어떻게 구성하시겠습니까?

A) 단일 React 앱 내 라우팅으로 분리 (하나의 빌드, 경로로 구분)
B) 별도 React 앱 2개 (customer-app, admin-app 각각 독립 빌드)
C) 모노레포 내 별도 패키지 (공유 컴포넌트 + 개별 앱)
X) Other (please describe after [Answer]: tag below)

[Answer]: A) 단일 React 앱 내 라우팅으로 분리 (하나의 빌드, 경로로 구분)

### 서비스 레이어 설계

## Question 4
주문 상태 변경 흐름을 어떻게 처리하시겠습니까?

A) 단순 상태 업데이트 (API 호출로 직접 상태 변경, 별도 검증 없음)
B) 상태 머신 패턴 (허용된 전이만 가능: 대기중→준비중→완료, 역방향 불가)
X) Other (please describe after [Answer]: tag below)

[Answer]: B) 상태 머신 패턴 (허용된 전이만 가능: 대기중→준비중→완료, 역방향 불가)

## Question 5
SSE(Server-Sent Events) 이벤트 구조를 어떻게 설계하시겠습니까?

A) 단일 이벤트 타입 (모든 변경사항을 하나의 이벤트로 전송, 클라이언트가 필터링)
B) 이벤트 타입별 분리 (new_order, order_status_changed, order_deleted 등 개별 이벤트)
X) Other (please describe after [Answer]: tag below)

[Answer]: B) 이벤트 타입별 분리 (new_order, order_status_changed, order_deleted 등 개별 이벤트)

### 데이터 액세스 패턴

## Question 6
데이터베이스 액세스 방식은 어떻게 하시겠습니까?

A) SQLAlchemy ORM (모델 클래스 기반, 자동 마이그레이션)
B) Raw SQL + asyncpg (직접 쿼리 작성, 최대 성능)
C) SQLAlchemy ORM + Alembic 마이그레이션 (ORM + 명시적 마이그레이션 관리)
X) Other (please describe after [Answer]: tag below)

[Answer]: A) SQLAlchemy ORM (모델 클래스 기반, 자동 마이그레이션)

## Question 7
테이블 세션 종료 시 주문 이력 처리 방식은 어떻게 하시겠습니까?

A) 별도 OrderHistory 테이블로 데이터 복사 후 원본 삭제
B) Order 테이블에 세션 상태 플래그 추가 (is_archived), 논리적 분리만 수행
X) Other (please describe after [Answer]: tag below)

[Answer]: A) 별도 OrderHistory 테이블로 데이터 복사 후 원본 삭제

### 의존성 및 통신 패턴

## Question 8
프론트엔드-백엔드 API 통신 방식은 어떻게 하시겠습니까?

A) Axios (인터셉터, 요청 취소 등 풍부한 기능)
B) Fetch API (브라우저 내장, 추가 라이브러리 없음)
C) React Query + Axios (서버 상태 캐싱 + HTTP 클라이언트)
D) React Query + Fetch (서버 상태 캐싱 + 내장 API)
X) Other (please describe after [Answer]: tag below)

[Answer]: A) Axios (인터셉터, 요청 취소 등 풍부한 기능)

## Question 9
한국어 + 영어 다국어 지원 방식은 어떻게 하시겠습니까?

A) react-i18next 라이브러리 (JSON 번역 파일, 동적 언어 전환)
B) 커스텀 Context 기반 (간단한 번역 객체, 직접 구현)
X) Other (please describe after [Answer]: tag below)

[Answer]: A) react-i18next 라이브러리 (JSON 번역 파일, 동적 언어 전환)
