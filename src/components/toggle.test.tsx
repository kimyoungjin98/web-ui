// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { Toggle } from "./toggle";

afterEach(cleanup);

describe("Toggle", () => {
  it("supports uncontrolled activation with native button semantics", () => {
    render(<Toggle aria-label="알림 받기" />);

    const toggle = screen.getByRole("switch", { name: "알림 받기" });
    expect(toggle.getAttribute("aria-checked")).toBe("false");

    fireEvent.click(toggle);
    expect(toggle.getAttribute("aria-checked")).toBe("true");
    expect(toggle.tagName).toBe("BUTTON");
    expect(toggle.getAttribute("type")).toBe("button");
  });

  it("connects visible label content to the switch", () => {
    render(<Toggle label="자동 승인" />);

    const toggle = screen.getByRole("switch", { name: "자동 승인" });
    fireEvent.click(screen.getByText("자동 승인"));

    expect(toggle.getAttribute("aria-checked")).toBe("true");
  });

  it("reports controlled changes without changing state itself", () => {
    const onCheckedChange = vi.fn();
    render(
      <Toggle
        aria-label="공개 여부"
        checked={false}
        onCheckedChange={onCheckedChange}
      />,
    );

    const toggle = screen.getByRole("switch", { name: "공개 여부" });
    fireEvent.click(toggle);

    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(toggle.getAttribute("aria-checked")).toBe("false");
  });

  it("cannot be activated when disabled", () => {
    const onCheckedChange = vi.fn();
    render(
      <Toggle
        aria-label="비활성 토글"
        disabled
        onCheckedChange={onCheckedChange}
      />,
    );

    fireEvent.click(screen.getByRole("switch", { name: "비활성 토글" }));

    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
