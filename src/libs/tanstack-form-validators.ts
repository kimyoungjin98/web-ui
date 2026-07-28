export const onChangeValidator = (name: string, value: string) =>
  value ? undefined : `${name}을(를) 입력하세요`;

export const passwordValidator = (value: string) => {
  if (!value) {
    return "비밀번호를 입력하세요";
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
