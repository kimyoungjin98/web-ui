# @repo/ui

ERP 클라이언트에서 공유하는 UI 컴포넌트와 디자인 토큰 계약입니다.

## 스타일 사용

앱의 전역 CSS에서 한 번만 `@repo/ui/styles.css`를 import합니다. 이 파일은 Tailwind v4의 semantic color utility, `shadow-card`와 타이포그래피 기본값을 제공합니다.

```css
@import "@repo/ui/styles.css";
```

Spacing과 radius는 Tailwind 기본 유틸리티를 사용합니다. 예를 들어 `gap-2`, `px-4`, `rounded-sm`, `rounded-lg`, `rounded-lg`, `rounded-full`을 사용하며, UI 패키지에서 별도 spacing/radius scale을 재정의하지 않습니다.

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

## 타이포그래피

기본 본문·입력값·안내문·표 데이터는 400(`font-normal`), 버튼·폼 라벨·표 헤더·선택 상태는 500(`font-medium`), 제목은 600(`font-semibold`)을 사용합니다. `styles.css`의 base layer가 HTML 기본값을 제공하고 컴포넌트의 유틸리티가 역할별 두께를 지정합니다.

`Paragraph`는 부모의 글꼴 두께를 상속합니다. 본문 영역의 기본값은 400이고, 버튼 안에서는 버튼의 500을 유지합니다. `fontWeight="medium"` 또는 `fontWeight="semibold"`로 명시적으로 강조할 수 있습니다. 기존 fontWeight API와 호출부 className 재정의는 유지합니다.

## 결과 안내

빈 결과·오류·접근 불가·선택 대기는 `Result`로 표현합니다. `@repo/ui`에서 import할 수 있으며 제목은 600, 설명은 400을 사용합니다. figure는 장식 요소로 스크린 리더에서 숨깁니다. 아이콘만으로 상태를 전달하지 않고 title에 상태를 명시합니다.

```tsx
<Result
  title="목록을 불러오지 못했습니다."
  description="잠시 후 다시 시도해 주세요."
  role="alert"
  button={
    <Result.Button variant="outline" onClick={() => void refetch()}>
      다시 시도
    </Result.Button>
  }
/>
```

DataGrid는 빈 목록에 Result를 사용하며 기존 `emptyMessage`를 그대로 받습니다. 작은 패널은 `className="min-h-48 px-4 py-8"`로 크기를 조절할 수 있습니다. 로딩과 필드 검증에는 각각 Spinner/Skeleton과 FormItem/Hint를 사용합니다.

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
- DataGrid 컬럼의 `orderBy`는 화면용 `id`와 서버 정렬 키를 분리할 때 사용합니다. 예를 들어 `id: "product"`, `orderBy: "product.mid"`로 지정하면 정렬 콜백과 API 요청에 `product.mid`가 전달됩니다.
- 파일 업로더의 드롭 영역은 키보드 Enter/Space로 파일 선택기를 열 수 있어야 하며, Space 입력은 페이지 스크롤을 유발하지 않아야 합니다.
- 모션을 추가할 때는 `prefers-reduced-motion` 대체 동작도 함께 제공합니다.
- 새 컴포넌트는 기본/hover/focus/disabled/error 상태와 키보드 조작을 검증한 뒤 추가합니다.

## 사이드 내비게이션

`SideNav`, `SideHeader`, `SideItemWrapper`, `SideItem`을 조합해 사이드 메뉴를 구성합니다. 앱이 메뉴 데이터, 권한 필터링, 현재 항목과 이동 콜백을 전달하고, UI는 그룹 펼침과 표시를 처리합니다. Next.js 라우터나 앱 스토어에는 의존하지 않습니다.

```tsx
<SideNav isSidebarCollapsed={collapsed}>
  <SideHeader
    title="메뉴"
    isSidebarCollapsed={collapsed}
    rightButton={toggleButton}
  />
  <nav aria-label="주 메뉴">
    <SideItemWrapper>
      <SideItem
        menu={{
          label: "슬롯 관리",
          icon: "gridicons:list-ordered",
          isSidebarCollapsed: collapsed,
          children: [
            {
              label: "진행 중",
              active: currentPath === "/slots/active",
              onClick: () => navigate("/slots/active"),
            },
          ],
        }}
      />
    </SideItemWrapper>
  </nav>
</SideNav>
```

`SideItem`은 활성 하위 항목이 바뀌면 해당 그룹을 펼칩니다. `active`는 현재 항목 표시이며 그룹의 펼침 상태와는 별개입니다. `left`에 사용자 정의 아이콘을 전달할 수 있고, `disabled`로 항목을 비활성화할 수 있습니다. 사이드바는 기본적으로 `md` 이상에서 표시합니다.

## 전역 알림

`AppAlertHost`와 `Toaster`는 앱 루트에 각각 한 번만 mount합니다. `appAlert.confirm()`은 호출 순서대로 표시되며, 각 Promise는 확인 또는 취소 시 해결됩니다.
