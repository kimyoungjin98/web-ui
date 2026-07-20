import assert from "node:assert/strict";
import test from "node:test";

import { UploadQueue } from "./queue.ts";

const nextTurn = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

test("선택한 파일은 한 번에 하나씩 순서대로 업로드한다", async () => {
  const queue = new UploadQueue<{ id: string }>();
  const order: string[] = [];
  const releases: Array<() => void> = [];
  let activeCount = 0;
  let maxActiveCount = 0;

  queue.add(
    [{ id: "first" }, { id: "second" }, { id: "third" }],
    async (item, _signal) => {
      order.push(item.id);
      activeCount += 1;
      maxActiveCount = Math.max(maxActiveCount, activeCount);
      await new Promise<void>((resolve) => releases.push(resolve));
      activeCount -= 1;
    },
  );

  await nextTurn();
  assert.deepEqual(order, ["first"]);
  releases.shift()?.();
  await nextTurn();
  assert.deepEqual(order, ["first", "second"]);
  releases.shift()?.();
  await nextTurn();
  assert.deepEqual(order, ["first", "second", "third"]);
  releases.shift()?.();
  await nextTurn();
  assert.equal(maxActiveCount, 1);
});

test("대기 파일 취소 후 재시도해도 중복 업로드하지 않는다", async () => {
  const queue = new UploadQueue<{ id: string }>();
  const order: string[] = [];
  let finishSecond: () => void = () => {};
  let releaseFirst: () => void = () => {};
  const secondFinished = new Promise<void>((resolve) => {
    finishSecond = resolve;
  });

  const upload = async (item: { id: string }, _signal: AbortSignal) => {
    order.push(item.id);
    if (item.id === "first") {
      await new Promise<void>((resolve) => {
        releaseFirst = resolve;
      });
    }
    if (item.id === "second") finishSecond();
  };

  queue.add([{ id: "first" }, { id: "second" }], upload);
  await nextTurn();
  queue.cancel("second");
  queue.add([{ id: "second" }], upload);
  releaseFirst();
  await secondFinished;

  assert.deepEqual(order, ["first", "second"]);
});

