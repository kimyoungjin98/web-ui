import { ColorToken } from "../../themes/color-token";

export type ParagraphFontWeight = "regular" | "medium" | "semibold" | "bold";

export type ParagraphTypography =
  | "t1"
  | "st1"
  | "st2"
  | "st3"
  | "t2"
  | "st4"
  | "st5"
  | "st6"
  | "t3"
  | "st7"
  | "t4"
  | "st8"
  | "st9"
  | "t5"
  | "st10"
  | "t6"
  | "st11"
  | "t7"
  | "st12"
  | "st13";

export type ParagraphProps = {
  children?: React.ReactNode;

  /**
   * 텍스트 크기를 결정해요
   */
  typography?: ParagraphTypography;

  /**
   * display 속성을 결정해요
   */
  display?: "block" | "inline";

  /**
   * 텍스트가 길어질 경우 말줄임표(...)를 표시할지 여부를 결정해요
   * 예를 들어 `ellipsisAfterLines={2}`로 설정하면 2줄 이후에 말줄임표(...)를 표시해요
   */
  ellipsisAfterLines?: number;

  /**
   * 텍스트 정렬 방식을 결정해요
   */
  textAlign?:
    | "inherit"
    | "initial"
    | "revert"
    | "revert-layer"
    | "unset"
    | "center"
    | "end"
    | "justify"
    | "left"
    | "match-parent"
    | "right"
    | "start";

  /**
   * 텍스트의 굵기를 결정해요
   */
  fontWeight?: ParagraphFontWeight;

  /**
   * 텍스트 색상을 결정해요
   */
  color?: ColorToken;
};
