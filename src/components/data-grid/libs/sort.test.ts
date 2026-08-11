import assert from "node:assert/strict";
import test from "node:test";
import { getNextSort } from "./sort.ts";

test("화면 컬럼 ID와 서버 orderBy 키를 함께 반환한다", () => {
  assert.deepEqual(getNextSort(null, "product", "product.mid"), {
    columnId: "product",
    orderBy: "product.mid",
    direction: "asc",
  });
});

test("같은 컬럼을 다시 누르면 서버 정렬 키를 유지한 채 방향을 바꾼다", () => {
  assert.deepEqual(
    getNextSort(
      { columnId: "product", orderBy: "product.mid", direction: "asc" },
      "product",
      "product.mid",
    ),
    {
      columnId: "product",
      orderBy: "product.mid",
      direction: "desc",
    },
  );
});
