// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ACTIVE_METRIC_CARD_CLASS_NAME, MetricCard } from "./metric-card";

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

  it("applies the shared active style", () => {
    render(
      <MetricCard
        interactive
        aria-pressed
        className={ACTIVE_METRIC_CARD_CLASS_NAME}
        label="처리 대기"
        value="3건"
      />,
    );

    expect(screen.getByRole("button").className.split(" ")).toEqual(
      expect.arrayContaining([
        "border-primary/30",
        "bg-primary-soft",
        "hover:bg-primary-soft",
      ]),
    );
  });
});
