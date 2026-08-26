// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { UiSizeProvider } from "../providers/ui-size-provider";
import { Tabs } from "./tabs";

afterEach(cleanup);

const options = [
  { label: "전체", value: "all" },
  { label: "진행 중", value: "active" },
] as const;

describe("Tabs", () => {
  it("applies the requested size", () => {
    render(
      <Tabs
        aria-label="상태"
        onValueChange={vi.fn()}
        options={[...options]}
        size="lg"
        value="all"
      />,
    );

    expect(screen.getByRole("button", { name: "전체" }).className).toContain(
      "py-2",
    );
    expect(screen.getByText("전체").className).toContain("text-base");
  });

  it("uses the size provider default when size is omitted", () => {
    render(
      <UiSizeProvider sizes={{ tabs: "xs" }}>
        <Tabs
          aria-label="상태"
          onValueChange={vi.fn()}
          options={[...options]}
          value="all"
        />
      </UiSizeProvider>,
    );

    expect(screen.getByRole("button", { name: "전체" }).className).toContain(
      "py-0.5",
    );
    expect(screen.getByText("전체").className).toContain("text-xs");
  });
});
