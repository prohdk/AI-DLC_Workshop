# Backend Functional Design Plan

## 설계 단계
- [x] 도메인 엔티티 상세 정의 (domain-entities.md)
- [x] 비즈니스 로직 모델 정의 (business-logic-model.md)
- [x] 비즈니스 규칙 및 검증 로직 정의 (business-rules.md)

---

## 설계 질문

아래 질문에 `[Answer]:` 태그 뒤에 선택지 알파벳을 입력해 주세요.

### 주문 비즈니스 로직

## Question 1
주문 번호 생성 방식은 어떻게 하시겠습니까?

A) 자동 증가 정수 (1, 2, 3, ... — 세션별 리셋 없이 전체 순차)
B) 날짜 기반 순번 (20260427-001, 20260427-002, ... — 일별 리셋)
C) 테이블별 순번 (T5-001, T5-002, ... — 세션 종료 시 리셋)
X) Other (please describe after [Answer]: tag below)

[Answer]: A) 자동 증가 정수 (1, 2, 3, ... — 세션별 리셋 없이 전체 순차)

## Question 2
주문 생성 시 메뉴 가격 처리 방식은 어떻게 하시겠습니까?

A) 주문 시점의 메뉴 가격을 OrderItem에 스냅샷 저장 (이후 메뉴 가격 변경 영향 없음)
B) MenuItem 참조만 저장 (메뉴 가격 변경 시 기존 주문 금액도 변경됨)
X) Other (please describe after [Answer]: tag below)

[Answer]: A) 주문 시점의 메뉴 가격을 OrderItem에 스냅샷 저장 (이후 메뉴 가격 변경 영향 없음)

### 세션 및 이력 관리

## Question 3
테이블 세션 시작 시점은 언제로 하시겠습니까?

A) 해당 테이블의 첫 주문 생성 시 자동으로 새 세션 시작
B) 관리자가 명시적으로 "새 세션 시작" 버튼 클릭 시
X) Other (please describe after [Answer]: tag below)

[Answer]: A) 해당 테이블의 첫 주문 생성 시 자동으로 새 세션 시작

## Question 4
OrderHistory로 이력 이동 시 어떤 데이터를 저장하시겠습니까?

A) 정규화 — OrderHistory에 주문 메타 정보만 저장, OrderItem은 별도 OrderHistoryItem 테이블
B) 비정규화 — OrderHistory에 items_json 필드로 주문 항목을 JSON으로 통째로 저장
X) Other (please describe after [Answer]: tag below)

[Answer]: A) 정규화 — OrderHistory에 주문 메타 정보만 저장, OrderItem은 별도 OrderHistoryItem 테이블

### 인증 및 보안

## Question 5
로그인 시도 제한은 어떤 수준으로 하시겠습니까?

A) 간단한 카운터 — 5회 실패 시 15분 잠금 (인메모리 저장)
B) DB 기반 — 실패 횟수/시간 DB 저장, 설정 가능한 임계값
C) 로그인 시도 제한 없음 (MVP에서는 생략)
X) Other (please describe after [Answer]: tag below)

[Answer]: A) 간단한 카운터 — 5회 실패 시 15분 잠금 (인메모리 저장)

## Question 6
JWT 토큰에 어떤 정보를 포함하시겠습니까?

A) 최소 정보 — sub(사용자 ID), role(admin/table), exp(만료 시간)
B) 확장 정보 — sub, role, exp + store_id, table_id(테이블인 경우), username(관리자인 경우)
X) Other (please describe after [Answer]: tag below)

[Answer]: A) 최소 정보 — sub(사용자 ID), role(admin/table), exp(만료 시간)

### 메뉴 관리

## Question 7
카테고리 삭제 시 해당 카테고리의 메뉴 항목은 어떻게 처리하시겠습니까?

A) 캐스케이드 삭제 — 카테고리 삭제 시 소속 메뉴도 함께 삭제
B) 삭제 차단 — 메뉴가 있는 카테고리는 삭제 불가 (먼저 메뉴 삭제/이동 필요)
X) Other (please describe after [Answer]: tag below)

[Answer]: B) 삭제 차단 — 메뉴가 있는 카테고리는 삭제 불가 (먼저 메뉴 삭제/이동 필요)

## Question 8
메뉴 노출 순서 조정 방식은 어떻게 하시겠습니까?

A) display_order 정수 필드 — 드래그앤드롭 시 순서 값 일괄 업데이트
B) display_order 정수 필드 — 위/아래 버튼으로 인접 항목과 순서 교환
X) Other (please describe after [Answer]: tag below)

[Answer]: A) display_order 정수 필드 — 드래그앤드롭 시 순서 값 일괄 업데이트
