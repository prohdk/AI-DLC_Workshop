# Frontend Functional Design Plan

## 설계 단계
- [x] 프론트엔드 컴포넌트 상세 정의 (frontend-components.md)
- [x] 비즈니스 로직 모델 정의 (business-logic-model.md)
- [x] 비즈니스 규칙 및 검증 로직 정의 (business-rules.md)

---

## 설계 질문

아래 질문에 `[Answer]:` 태그 뒤에 선택지 알파벳을 입력해 주세요.

### 고객용 UI

## Question 1
메뉴 화면의 카테고리 네비게이션 방식은 어떻게 하시겠습니까?

A) 상단 탭 바 (가로 스크롤, 카테고리 클릭 시 해당 섹션으로 스크롤)
B) 좌측 사이드바 (세로 카테고리 목록, 고정 위치)
C) 상단 드롭다운 셀렉트 (카테고리 선택 시 필터링)
X) Other (please describe after [Answer]: tag below)

[Answer]: A) 상단 탭 바 (가로 스크롤, 카테고리 클릭 시 해당 섹션으로 스크롤)

## Question 2
장바구니 UI 형태는 어떻게 하시겠습니까?

A) 하단 고정 바 + 슬라이드업 패널 (하단에 총 금액/수량 표시, 클릭 시 상세 패널 올라옴)
B) 우측 사이드 드로어 (햄버거 메뉴처럼 우측에서 슬라이드)
C) 별도 페이지 (/customer/cart 경로)
X) Other (please describe after [Answer]: tag below)

[Answer]: A) 하단 고정 바 + 슬라이드업 패널 (하단에 총 금액/수량 표시, 클릭 시 상세 패널 올라옴)

## Question 3
주문 성공 후 5초 리다이렉트 화면에 어떤 정보를 표시하시겠습니까?

A) 최소 정보 — 주문 번호 + "주문이 완료되었습니다" 메시지 + 카운트다운
B) 상세 정보 — 주문 번호 + 주문 항목 요약 + 총 금액 + 카운트다운
X) Other (please describe after [Answer]: tag below)

[Answer]: B) 상세 정보 — 주문 번호 + 주문 항목 요약 + 총 금액 + 카운트다운

### 관리자용 UI

## Question 4
관리자 대시보드의 테이블 카드 레이아웃은 어떻게 하시겠습니까?

A) 반응형 그리드 (화면 크기에 따라 2~4열 자동 조정)
B) 고정 3열 그리드
C) 리스트 형태 (세로 목록)
X) Other (please describe after [Answer]: tag below)

[Answer]: A) 반응형 그리드 (화면 크기에 따라 2~4열 자동 조정)

## Question 5
관리자 메뉴 관리 화면의 메뉴 순서 변경 UI는 어떻게 하시겠습니까?

A) 드래그앤드롭 (react-beautiful-dnd 또는 dnd-kit 라이브러리)
B) 위/아래 화살표 버튼 (간단한 구현)
X) Other (please describe after [Answer]: tag below)

[Answer]: A) 드래그앤드롭 (react-beautiful-dnd 또는 dnd-kit 라이브러리)

### 공통 UI/UX

## Question 6
CSS 스타일링 방식은 어떻게 하시겠습니까?

A) Tailwind CSS (유틸리티 클래스 기반)
B) CSS Modules (컴포넌트별 스코프 CSS)
C) styled-components (CSS-in-JS)
D) MUI (Material UI 컴포넌트 라이브러리)
X) Other (please describe after [Answer]: tag below)

[Answer]: A) Tailwind CSS (유틸리티 클래스 기반)

## Question 7
로딩/에러 상태 표시 방식은 어떻게 하시겠습니까?

A) 간단한 스피너 + 인라인 에러 메시지 (직접 구현)
B) 토스트 알림 (react-hot-toast 등 라이브러리)
C) 스피너 + 토스트 알림 조합
X) Other (please describe after [Answer]: tag below)

[Answer]: A) 간단한 스피너 + 인라인 에러 메시지 (직접 구현)
