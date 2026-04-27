# Unit of Work Plan

## 분해 계획

이 프로젝트는 단일 배포 단위(Docker Compose)의 모놀리스 구조입니다.
Application Design에서 정의된 컴포넌트를 기반으로 작업 단위(Unit of Work)를 분해합니다.

### 생성 단계
- [x] 작업 단위 정의 및 책임 할당 (unit-of-work.md)
- [x] 작업 단위 간 의존성 매트릭스 (unit-of-work-dependency.md)
- [x] 기능 요구사항 → 작업 단위 매핑 (unit-of-work-story-map.md)
- [x] 코드 구조 전략 문서화 (unit-of-work.md 내)
- [x] 단위 경계 및 의존성 검증

---

## 분해 질문

아래 질문에 `[Answer]:` 태그 뒤에 선택지 알파벳을 입력해 주세요.

## Question 1
작업 단위를 어떤 기준으로 분해하시겠습니까? 이 프로젝트는 모놀리스(단일 배포)이므로 논리적 모듈 단위로 분해합니다.

A) 계층별 분해 — Backend 전체를 하나의 Unit, Frontend 전체를 하나의 Unit (2 Units)
B) 도메인별 분해 — 인증, 메뉴, 주문, 테이블 각각을 Backend+Frontend 포함한 Unit으로 (4 Units)
C) 계층+핵심 도메인 분해 — Backend 1 Unit + Frontend(Customer) 1 Unit + Frontend(Admin) 1 Unit (3 Units)
X) Other (please describe after [Answer]: tag below)

[Answer]: A) 계층별 분해 — Backend 전체를 하나의 Unit, Frontend 전체를 하나의 Unit (2 Units)

## Question 2
작업 단위의 개발 순서(우선순위)를 어떻게 정하시겠습니까?

A) 데이터 기반 → API → UI 순서 (DB 스키마/모델 먼저, 그 다음 백엔드 API, 마지막 프론트엔드)
B) 기능 흐름 순서 (인증 → 메뉴 → 주문 → 관리 순으로 전체 스택을 한 번에)
C) 핵심 기능 우선 (주문 생성 흐름을 먼저 완성, 나머지 기능 추가)
X) Other (please describe after [Answer]: tag below)

[Answer]: A) 데이터 기반 → API → UI 순서 (DB 스키마/모델 먼저, 그 다음 백엔드 API, 마지막 프론트엔드)

## Question 3
Construction Phase에서 각 Unit의 Functional Design을 어느 수준으로 수행하시겠습니까?

A) 상세 — 모든 Unit에 대해 Functional Design 수행 (비즈니스 규칙, 상태 다이어그램, 데이터 흐름 상세 정의)
B) 선택적 — 복잡한 Unit(주문/세션 관리)만 Functional Design, 단순 Unit(메뉴 CRUD)은 바로 Code Generation
X) Other (please describe after [Answer]: tag below)

[Answer]: A) 상세 — 모든 Unit에 대해 Functional Design 수행 (비즈니스 규칙, 상태 다이어그램, 데이터 흐름 상세 정의)
