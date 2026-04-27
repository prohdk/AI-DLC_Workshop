# 요구사항 검증 질문

요구사항 문서를 분석한 결과, 아래 질문들에 대한 답변이 필요합니다.
각 질문의 `[Answer]:` 태그 뒤에 선택지 알파벳을 입력해 주세요.
선택지가 맞지 않으면 마지막 옵션(Other)을 선택하고 설명을 추가해 주세요.

---

## Question 1
백엔드 기술 스택으로 어떤 것을 사용하시겠습니까?

A) Node.js + Express (JavaScript/TypeScript)
B) Python + FastAPI
C) Java + Spring Boot
D) Go + Gin/Echo
X) Other (please describe after [Answer]: tag below)

[Answer]: B) Python + FastAPI

## Question 2
프론트엔드 기술 스택으로 어떤 것을 사용하시겠습니까?

A) React (JavaScript/TypeScript)
B) Vue.js
C) Next.js (React 기반 풀스택)
D) Svelte/SvelteKit
X) Other (please describe after [Answer]: tag below)

[Answer]: A) React (JavaScript/TypeScript)

## Question 3
데이터베이스로 어떤 것을 사용하시겠습니까?

A) PostgreSQL (관계형)
B) MySQL (관계형)
C) DynamoDB (NoSQL)
D) MongoDB (NoSQL)
X) Other (please describe after [Answer]: tag below)

[Answer]: A) PostgreSQL (관계형)

## Question 4
배포 환경은 어디를 대상으로 하시겠습니까?

A) AWS 클라우드 (ECS, Lambda 등)
B) 로컬/온프레미스 서버 (Docker Compose 등)
C) AWS 클라우드 + 로컬 개발 환경 모두 지원
D) 아직 미정 — 먼저 로컬에서 동작하는 것에 집중
X) Other (please describe after [Answer]: tag below)

[Answer]: B) 로컬/온프레미스 서버 (Docker Compose 등)

## Question 5
매장(Store) 관련 데이터 모델에 대해 질문드립니다. 이 시스템은 단일 매장만 지원하면 되나요, 아니면 다중 매장(멀티테넌트)을 지원해야 하나요?

A) 단일 매장만 지원 (하나의 매장 데이터만 관리)
B) 다중 매장 지원 (여러 매장이 각각 독립적으로 운영)
X) Other (please describe after [Answer]: tag below)

[Answer]: A) 단일 매장만 지원 (하나의 매장 데이터만 관리)

## Question 6
메뉴 이미지 관리 방식은 어떻게 하시겠습니까? (요구사항에 "이미지 URL"로 명시되어 있습니다)

A) 외부 이미지 URL만 사용 (이미지 업로드 기능 없음, URL 직접 입력)
B) 서버에 이미지 파일 업로드 후 URL 자동 생성
C) S3 등 클라우드 스토리지에 업로드 후 URL 자동 생성
X) Other (please describe after [Answer]: tag below)

[Answer]: A) 외부 이미지 URL만 사용 (이미지 업로드 기능 없음, URL 직접 입력)

## Question 7
실시간 주문 모니터링(SSE)에서 관리자가 여러 브라우저/탭에서 동시에 접속할 수 있어야 하나요?

A) 단일 접속만 지원 (한 번에 하나의 관리자 세션)
B) 다중 접속 지원 (여러 탭/기기에서 동시 모니터링 가능)
X) Other (please describe after [Answer]: tag below)

[Answer]: B) 다중 접속 지원 (여러 탭/기기에서 동시 모니터링 가능)

## Question 8
테이블 수는 매장당 최대 몇 개 정도를 예상하시나요? (성능 설계 기준)

A) 소규모: 1~10개
B) 중규모: 11~30개
C) 대규모: 31~100개
X) Other (please describe after [Answer]: tag below)

[Answer]: B) 중규모: 11~30개

## Question 9
관리자 계정은 어떻게 생성되나요? (요구사항에 매장 인증은 있지만 계정 생성 방식이 명시되지 않았습니다)

A) 시스템 초기 설정 시 시드 데이터로 생성 (DB에 직접 삽입)
B) 관리자 회원가입 API 제공
C) 슈퍼 관리자가 매장 관리자 계정을 생성
X) Other (please describe after [Answer]: tag below)

[Answer]: A) 시스템 초기 설정 시 시드 데이터로 생성 (DB에 직접 삽입)

## Question 10
고객용 인터페이스의 언어는 어떻게 하시겠습니까?

A) 한국어 전용
B) 한국어 + 영어 (다국어는 constraints에서 제외되었지만 기본 2개 언어)
X) Other (please describe after [Answer]: tag below)

[Answer]: B) 한국어 + 영어 (다국어는 constraints에서 제외되었지만 기본 2개 언어)

---

## Question 11: Security Baseline 확장 기능
이 프로젝트에 보안 확장 규칙을 적용하시겠습니까?

A) Yes — 모든 보안 규칙을 필수 제약 조건으로 적용 (프로덕션 수준 애플리케이션에 권장)
B) No — 보안 규칙 건너뛰기 (PoC, 프로토타입, 실험적 프로젝트에 적합)
X) Other (please describe after [Answer]: tag below)

[Answer]: B) No — 보안 규칙 건너뛰기 (PoC, 프로토타입, 실험적 프로젝트에 적합)

## Question 12: Property-Based Testing 확장 기능
이 프로젝트에 속성 기반 테스트(PBT) 규칙을 적용하시겠습니까?

A) Yes — 모든 PBT 규칙을 필수 제약 조건으로 적용 (비즈니스 로직, 데이터 변환, 직렬화, 상태 관리 컴포넌트가 있는 프로젝트에 권장)
B) Partial — 순수 함수와 직렬화 라운드트립에만 PBT 규칙 적용 (알고리즘 복잡도가 제한적인 프로젝트에 적합)
C) No — 모든 PBT 규칙 건너뛰기 (단순 CRUD, UI 전용, 또는 비즈니스 로직이 거의 없는 프로젝트에 적합)
X) Other (please describe after [Answer]: tag below)

[Answer]: C) No — 모든 PBT 규칙 건너뛰기 (단순 CRUD, UI 전용, 또는 비즈니스 로직이 거의 없는 프로젝트에 적합)
