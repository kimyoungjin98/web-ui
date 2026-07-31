// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

afterEach(cleanup);

function RoleSelect({
  onValueChange = vi.fn(),
}: {
  onValueChange?: (value: string) => void;
}) {
  return (
    <Select defaultValue="USER" onValueChange={onValueChange}>
      <SelectTrigger aria-label="역할">
        <SelectValue>역할 선택</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="ADMIN">관리자</SelectItem>
        <SelectItem value="USER">일반 사용자</SelectItem>
        <SelectItem value="ADVERTISER">광고주</SelectItem>
      </SelectContent>
    </Select>
  );
}

describe("Select keyboard interaction", () => {
  it("renders the selected label before the popover is opened", () => {
    render(<RoleSelect />);

    expect(screen.getByRole("button", { name: "역할" }).textContent).toContain(
      "일반 사용자",
    );
  });

  it("opens with ArrowDown and focuses the current option", () => {
    render(<RoleSelect />);

    const trigger = screen.getByRole("button", { name: "역할" });
    fireEvent.keyDown(trigger, { key: "ArrowDown" });

    const selectedOption = screen.getByRole("option", { name: "일반 사용자" });
    expect(screen.getByRole("listbox")).not.toBeNull();
    expect(document.activeElement).toBe(selectedOption);
    expect(selectedOption.getAttribute("data-active")).toBe("true");
  });

  it("selects the keyboard-highlighted option with Enter", () => {
    const onValueChange = vi.fn();
    render(<RoleSelect onValueChange={onValueChange} />);

    const trigger = screen.getByRole("button", { name: "역할" });
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    fireEvent.keyDown(screen.getByRole("option", { name: "일반 사용자" }), {
      key: "ArrowDown",
    });
    fireEvent.keyDown(screen.getByRole("option", { name: "광고주" }), {
      key: "Enter",
    });

    expect(onValueChange).toHaveBeenCalledWith("ADVERTISER");
    expect(screen.queryByRole("listbox")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("closes with Escape and restores focus to the trigger", async () => {
    render(<RoleSelect />);

    const trigger = screen.getByRole("button", { name: "역할" });
    fireEvent.keyDown(trigger, { key: "ArrowDown" });
    fireEvent.keyDown(screen.getByRole("option", { name: "일반 사용자" }), {
      key: "Escape",
    });

    expect(screen.queryByRole("listbox")).toBeNull();
    await waitFor(() => {
      expect(document.activeElement).toBe(trigger);
    });
  });
});
