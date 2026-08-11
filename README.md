# @repo/ui

ERP 클라이언트에서 공유하는 UI 컴포넌트와 디자인 토큰 계약입니다.

## 스타일 사용

앱의 전역 CSS에서 한 번만 `@repo/ui/styles.css`를 import합니다. 이 파일은 Tailwind v4의 semantic color utility와 `shadow-card`만 추가합니다.

```css
@import "@repo/ui/styles.css";
```

Spacing과 radius는 Tailwind 기본 유틸리티를 사용합니다. 예를 들어 `gap-2`, `px-4`, `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-full`을 사용하며, UI 패키지에서 별도 spacing/radius scale을 재정의하지 않습니다.

`@repo/ui`는 semantic token 이름과 Tailwind 매핑을 제공하고, 실제 라이트·다크 팔레트 값은 클라이언트의 `app/globals.css`가 소유합니다. 새 색상 역할이 필요할 때는 hex 또는 Tailwind palette를 컴포넌트에 직접 추가하지 말고, 먼저 공통 토큰과 `ColorToken`을 정의합니다.

| 역할                     | token                                                        | 현재 값                       |
| ------------------------ | ------------------------------------------------------------ | ----------------------------- |
| 기본 표면 / 본문         | `background`, `foreground`, `neutral`                        | `apps/client/app/globals.css` |
| Card / Popover           | `card`, `popover`                                            | `apps/client/app/globals.css` |
| 주요 액션                | `primary`, `primary-hover`, `primary-soft`, `primary-border` | `apps/client/app/globals.css` |
| 보조 / 약한 표면         | `secondary`, `muted`, `accent`                               | `apps/client/app/globals.css` |
| 위험 / 테두리 / 입력     | `destructive`, `destructive-foreground`, `border`, `input`   | `apps/client/app/globals.css` |
| 포커스 / 링크 / 오버레이 | `ring`, `link`, `overlay`                                    | `apps/client/app/globals.css` |
| 상태                     | `info`, `warning`, `success` 및 foreground 토큰              | `apps/client/app/globals.css` |

각 foreground token은 대응 surface token의 텍스트 색입니다. 명도 대비가 바뀌는 테마를 추가할 때는 surface와 foreground를 함께 변경하고, 본문 텍스트는 WCAG 2.2 AA의 4.5:1 이상을 확인합니다.

## 접근성 기준

- 모든 버튼, 메뉴, 선택 요소, Dialog는 키보드만으로 조작 가능해야 합니다.
- 포커스 상태는 `:focus-visible`에서 충분히 식별 가능해야 하며 색상만으로 상태를 전달하지 않습니다.
- `FormItem`은 children을 label로 감싸지 않습니다. `htmlFor`와 입력 컴포넌트의 `id`를 연결합니다.

  ```tsx
  <FormItem htmlFor="email" label="이메일" required>
    <Input id="email" type="email" />
  </FormItem>
  ```

- 오류 메시지가 있으면 `FormItem`의 `error`/`errorId`와 입력 요소의 `aria-invalid`/`aria-describedby`를 연결합니다. 안내 문구도 동일하게 `hintId`로 연결합니다.

  ```tsx
  <FormItem
    error="올바른 이메일 주소를 입력하세요."
    errorId="email-error"
    htmlFor="email"
    label="이메일"
  >
    <Input aria-describedby="email-error" aria-invalid="true" id="email" />
  </FormItem>
  ```

- 현재 `Tabs`는 패널을 소유하지 않는 선택 컨트롤입니다. `role="group"`과 `aria-pressed`를 사용하므로, 탭 패널이 필요한 화면에는 ARIA Tabs primitive를 별도로 사용합니다.
- 선택 컨트롤은 방향키, Home, End로 비활성화된 항목을 건너뛰어 이동할 수 있어야 합니다.
- DataGrid는 `ariaLabel`로 표의 목적을 제공해야 합니다. 정렬 가능한 열은 현재 정렬 방향을 `aria-sort`로 전달합니다.
- 파일 업로더의 드롭 영역은 키보드 Enter/Space로 파일 선택기를 열 수 있어야 하며, Space 입력은 페이지 스크롤을 유발하지 않아야 합니다.
- 모션을 추가할 때는 `prefers-reduced-motion` 대체 동작도 함께 제공합니다.
- 새 컴포넌트는 기본/hover/focus/disabled/error 상태와 키보드 조작을 검증한 뒤 추가합니다.

## 전역 알림

`AppAlertHost`와 `Toaster`는 앱 루트에 각각 한 번만 mount합니다. `appAlert.confirm()`은 호출 순서대로 표시되며, 각 Promise는 확인 또는 취소 시 해결됩니다.
