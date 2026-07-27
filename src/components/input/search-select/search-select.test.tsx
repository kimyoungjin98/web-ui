// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SearchSelect } from "./search-select";

afterEach(cleanup);

describe("SearchSelect", () => {
  it("creates and selects an entered value with no matching option", async () => {
    const onCreateOption = vi.fn().mockResolvedValue({
      value: "incheon",
      label: "Incheon",
    });
    const onValueChange = vi.fn();

    render(
      <SearchSelect
        options={[{ value: "seoul", label: "Seoul" }]}
        onCreateOption={onCreateOption}
        onValueChange={onValueChange}
      />,
    );

    fireEvent.click(screen.getByRole("button"));
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Incheon" },
    });
    fireEvent.keyDown(screen.getByRole("textbox"), { key: "Enter" });

    expect(onCreateOption).toHaveBeenCalledWith("Incheon");
    await waitFor(() => {
      expect(onValueChange).toHaveBeenCalledWith("incheon");
    });
  });

  it("emits a search query without filtering server-provided options", () => {
    const onSearchChange = vi.fn();

    render(
      <SearchSelect
        shouldFilter={false}
        onSearchChange={onSearchChange}
        options={[{ value: "seoul", label: "Seoul" }]}
      />,
    );

    fireEvent.click(screen.getByRole("button"));
    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Incheon" },
    });

    expect(onSearchChange).toHaveBeenCalledWith("Incheon");
    expect(screen.getByRole("option", { name: "Seoul" })).not.toBeNull();
  });
});
