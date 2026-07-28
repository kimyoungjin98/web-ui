import { describe, expect, it } from "vitest";
import { passwordValidator } from "./tanstack-form-validators";

describe("passwordValidator", () => {
  it("accepts any non-empty password without complexity requirements", () => {
    expect(passwordValidator("1")).toBeUndefined();
    expect(passwordValidator("가나다")).toBeUndefined();
  });

  it("still requires a password", () => {
    expect(passwordValidator("")).toBe("비밀번호를 입력하세요");
  });
});
