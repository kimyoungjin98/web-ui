import assert from "node:assert/strict";
import test from "node:test";

import { getVisibleRowActions } from "./row-actions.ts";

type Row = { id: string; locked: boolean };

test("숨김 처리된 행 액션은 제외하고 선언 순서를 유지한다", () => {
  const actions = [
    { id: "edit", label: "수정", onSelect: () => undefined },
    {
      id: "delete",
      label: "삭제",
      hidden: (row: Row) => row.locked,
      onSelect: () => undefined,
    },
    { id: "history", label: "이력", onSelect: () => undefined },
  ];

  const visible = getVisibleRowActions({ id: "user-1", locked: true }, actions);

  assert.deepEqual(
    visible.map((action) => action.id),
    ["edit", "history"],
  );
});
