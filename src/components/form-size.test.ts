import assert from "node:assert/strict";
import test from "node:test";
import { getFormSize } from "./form-size.ts";

test("폼 크기 규격은 xs부터 lg까지 높이가 증가한다", () => {
  assert.equal(getFormSize("xs").height, "h-7");
  assert.equal(getFormSize("sm").height, "h-8");
  assert.equal(getFormSize("default").height, "h-9");
  assert.equal(getFormSize("lg").height, "h-11");
});
