// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { Result } from "./result";
import { afterEach, expect, test, vi } from "vitest";

afterEach(cleanup);

test("renders the result title", () => {
  render(<Result title="다시 시도해 주세요" />);

  expect(screen.getByText("다시 시도해 주세요")).not.toBeNull();
});

test("hides the figure from assistive technology", () => {
  render(
    <Result figure={<img src="/error.png" alt="오류 그림" />} title="오류" />,
  );

  expect(screen.queryByRole("img", { name: "오류 그림" })).toBeNull();
});

test("omits optional regions when they are not supplied", () => {
  const { container } = render(<Result title="완료" />);

  expect(container.querySelector("[data-result-figure]")).toBeNull();
  expect(container.querySelector("[data-result-description]")).toBeNull();
  expect(container.querySelector("[data-result-button]")).toBeNull();
});

test("Result.Button preserves disabled button behavior", () => {
  const onClick = vi.fn();
  render(
    <Result
      title="오류"
      button={
        <Result.Button disabled onClick={onClick}>
          다시 시도
        </Result.Button>
      }
    />,
  );

  const button = screen.getByRole("button", { name: "다시 시도" });
  fireEvent.click(button);
  expect(onClick).not.toHaveBeenCalled();
});
