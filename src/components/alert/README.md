# Alert

`appAlert`는 전역 다이얼로그 알림을 큐로 표시합니다. 앱 루트에
`<AppAlertHost />`를 한 번 렌더링한 뒤, 클라이언트 이벤트 핸들러에서 사용합니다.

```tsx
import { appAlert } from "@repo/ui";
```

## 일반 알림

`error`, `warning`, `info`, `success`는 모두 같은 인자를 사용합니다.

```ts
appAlert.error(title, description?);
appAlert.error(title, options?);
appAlert.error(title, description, options?);
```

`title`은 필수이며, 두 번째 인자에는 설명 문자열 또는 옵션 객체를 전달합니다.
단순 메시지만 필요하면 제목 하나만 전달합니다.

```tsx
appAlert.error("등록하지 못했습니다.");

appAlert.success("등록 완료", "실행 DB가 등록되었습니다.");

appAlert.warning("입력 확인", {
  description: "업체와 프로그램 ID를 입력해 주세요.",
  confirmLabel: "확인",
  onConfirm: () => focusFirstInvalidField(),
});
```

옵션은 다음과 같습니다.

| 옵션 | 설명 |
| --- | --- |
| `description` | 본문 설명. 문자열 또는 React 노드 |
| `confirmLabel` | 확인 버튼 문구. 기본값 `확인` |
| `onConfirm` | 확인 버튼을 눌렀을 때 실행할 함수 |

## 확인 알림

`confirm`은 취소 버튼이 있는 확인 다이얼로그를 띄우고,
사용자 선택 결과를 `Promise<boolean>`으로 반환합니다.

```ts
appAlert.confirm(title, description?);
appAlert.confirm(title, options?);
appAlert.confirm(title, description, options?);
```

```tsx
const confirmed = await appAlert.confirm(
  "실행 DB 삭제",
  "삭제한 데이터는 복구할 수 없습니다.",
);

if (confirmed) {
  remove.mutate({ id });
}
```

콜백 방식도 사용할 수 있습니다.

```tsx
appAlert.confirm("로그아웃", {
  description: "정말 로그아웃하시겠습니까?",
  variant: "warning",
  confirmLabel: "로그아웃",
  cancelLabel: "취소",
  onConfirm: logout,
  onCancel: () => console.info("로그아웃 취소"),
});
```

`confirm` 옵션은 일반 알림 옵션에 아래 항목이 추가됩니다.

| 옵션 | 설명 |
| --- | --- |
| `cancelLabel` | 취소 버튼 문구. 기본값 `취소` |
| `onCancel` | 취소 또는 다이얼로그 닫기 시 실행할 함수 |
| `variant` | `error`, `warning`, `info`, `success` 중 하나. 기본값 `warning` |

`appAlert`는 클라이언트 전용 API이므로 서버 컴포넌트나 서버 액션에서 직접 호출하면 안 됩니다.
