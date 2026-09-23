// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SideItem, type SideMenu } from "./side-item";

afterEach(cleanup);

describe("SideItem", () => {
  it("opens and closes a group independently of the active item", () => {
    render(
      <SideItem menu={{ label: "슬롯", children: [{ label: "진행 중" }] }} />,
    );
    const group = screen.getByRole("button", { name: "슬롯" });
    expect(group.getAttribute("aria-expanded")).toBe("false");

    fireEvent.click(group);
    expect(group.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("button", { name: "진행 중" })).not.toBeNull();

    fireEvent.click(group);
    expect(screen.queryByRole("button", { name: "진행 중" })).toBeNull();
  });

  it("reveals a newly active descendant after navigation", () => {
    const menu: SideMenu = {
      label: "슬롯",
      children: [{ label: "진행 중" }, { label: "종료" }],
    };
    const { rerender } = render(<SideItem menu={menu} />);
    rerender(
      <SideItem
        menu={{ ...menu, children: [{ label: "진행 중", active: true }] }}
      />,
    );

    expect(
      screen
        .getByRole("button", { name: "슬롯" })
        .getAttribute("aria-expanded"),
    ).toBe("true");
    expect(
      screen
        .getByRole("button", { name: "진행 중" })
        .getAttribute("aria-current"),
    ).toBe("page");
  });

  it("calls the supplied navigation action without submitting a surrounding form", () => {
    const onClick = vi.fn();
    const onSubmit = vi.fn((event) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <SideItem menu={{ label: "공지사항", onClick }} />
      </form>,
    );
    fireEvent.click(screen.getByRole("button", { name: "공지사항" }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("keeps labels accessible and hides descendants when collapsed", () => {
    render(
      <SideItem
        menu={{
          label: "슬롯",
          isSidebarCollapsed: true,
          children: [{ label: "진행 중", active: true }],
        }}
      />,
    );
    expect(screen.getByRole("button", { name: "슬롯" })).not.toBeNull();
    expect(screen.queryByRole("button", { name: "진행 중" })).toBeNull();
  });
});
