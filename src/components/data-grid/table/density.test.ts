import assert from "node:assert/strict";
import test from "node:test";
import { getDataGridDensity } from "./density.ts";

test("밀도별 행 높이가 단계적으로 작아진다", () => {
  const defaultDensity = getDataGridDensity("default");
  const comfortableDensity = getDataGridDensity("comfortable");
  const compactDensity = getDataGridDensity("compact");
  const ultraCompactDensity = getDataGridDensity("ultra-compact");

  assert.ok(comfortableDensity.rowHeight < defaultDensity.rowHeight);
  assert.ok(compactDensity.rowHeight < comfortableDensity.rowHeight);
  assert.ok(ultraCompactDensity.rowHeight < compactDensity.rowHeight);
  assert.equal(comfortableDensity.rowHeight, 48);
  assert.equal(ultraCompactDensity.rowHeight, 34);
});
