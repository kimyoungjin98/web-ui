export const onChangeValidator = (name: string, value: string) =>
  value ? undefined : `${name}을(를) 입력하세요`;

export const passwordValidator = (value: string) => {
  if (!value) {
    return "비밀번호를 입력하세요";
  }
  if (value.length < 8) {
    return "비밀번호는 최소 8자 이상이어야 합니다";
  }
  if (!/[A-Z]/.test(value)) {
    return "비밀번호에는 최소 하나의 대문자가 포함되어야 합니다";
  }
  if (!/[a-z]/.test(value)) {
    return "비밀번호에는 최소 하나의 소문자가 포함되어야 합니다";
  }
  if (!/[0-9]/.test(value)) {
    return "비밀번호에는 최소 하나의 숫자가 포함되어야 합니다";
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
    return "비밀번호에는 최소 하나의 특수 문자가 포함되어야 합니다";
  }
  return undefined;
};

export const emailValidator = (value: string) => {
  if (!value) {
    return "이메일을 입력하세요";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return "유효한 이메일 주소를 입력하세요";
  }
  return undefined;
};
