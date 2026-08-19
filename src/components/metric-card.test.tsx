// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MetricCard } from "./metric-card";

afterEach(cleanup);

describe("MetricCard", () => {
  it("supports pointer and keyboard activation when interactive", () => {
    const onClick = vi.fn();
    render(
      <MetricCard
        interactive
        label="처리 대기"
        value="3건"
        onClick={onClick}
      />,
    );

    const card = screen.getByRole("button");
    fireEvent.click(card);
    fireEvent.keyDown(card, { key: "Enter" });
    fireEvent.keyDown(card, { key: " " });

    expect(onClick).toHaveBeenCalledTimes(3);
  });
});
