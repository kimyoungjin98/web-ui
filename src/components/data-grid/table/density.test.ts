import assert from "node:assert/strict";
import test from "node:test";
import { getDataGridDensity } from "./density.ts";

test("compact와 ultra-compact는 기본 밀도보다 더 작은 행 높이를 제공한다", () => {
  const defaultDensity = getDataGridDensity("default");
  const compactDensity = getDataGridDensity("compact");
  const ultraCompactDensity = getDataGridDensity("ultra-compact");

  assert.ok(compactDensity.rowHeight < defaultDensity.rowHeight);
  assert.ok(ultraCompactDensity.rowHeight < compactDensity.rowHeight);
  assert.equal(ultraCompactDensity.rowHeight, 34);
});
