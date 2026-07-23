import type * as React from "react";

export type DataGridSort = {
  /** 정렬 대상 컬럼 ID입니다. */
  columnId: string;
  /** 오름차순 또는 내림차순 방향입니다. */
  direction: "asc" | "desc";
} | null;

/** 행 높이와 여백을 조절하는 DataGrid 표시 밀도입니다. */
export type DataGridDensity = "default" | "compact" | "ultra-compact";

/** AG Grid와 유사하게 JSON으로 전달할 수 있는 컬럼 정의입니다. */
export type DataGridColumnDef<T extends object> = {
  /** 셀 내용의 가로 정렬입니다. */
  align?: "left" | "center" | "right";
  /** 행 객체에서 읽을 필드명입니다. */
  field: Extract<keyof T, string>;
  /** 헤더에 표시할 텍스트입니다. 생략하면 필드명을 사용합니다. */
  headerName?: string;
  /** `true`이면 해당 컬럼을 렌더링하지 않습니다. */
  hide?: boolean;
  /** `right`이면 컬럼을 우측에 고정합니다. */
  pinned?: "right";
  /** 헤더 클릭을 통한 정렬 허용 여부입니다. */
  sortable?: boolean;
  /** 정렬·표시 형식을 위한 데이터 유형 힌트입니다. */
  type?: "text" | "number" | "date" | "boolean";
  /** 컬럼 너비입니다. 숫자는 px, 문자열은 CSS 길이로 해석합니다. */
  width?: number | string;
};

/** React 렌더링과 사용자 정의 셀을 지원하는 컬럼 정의입니다. */
export type DataGridColumn<T> = {
  /** 컬럼을 식별하는 고유 ID입니다. */
  id: string;
  /** 헤더에 렌더링할 콘텐츠입니다. */
  header: React.ReactNode;
  /** 기본 셀 콘텐츠를 얻을 행 속성 또는 렌더 함수입니다. */
  accessor?: keyof T | ((row: T, index: number) => React.ReactNode);
  /** 기본 accessor 대신 셀 콘텐츠를 직접 렌더링하는 함수입니다. */
  cell?: (row: T, index: number) => React.ReactNode;
  /** Excel 내보내기에서 사용할 값을 반환하는 함수입니다. */
  exportValue?: (row: T, index: number) => React.ReactNode;
  /** Excel 내보내기 대상 포함 여부입니다. */
  exportable?: boolean;
  /** 헤더 클릭을 통한 정렬 허용 여부입니다. */
  sortable?: boolean;
  /** 셀 내용의 가로 정렬입니다. */
  align?: "left" | "center" | "right";
  /** CSS 길이 문자열로 지정한 컬럼 너비입니다. */
  width?: string;
  /** `right`이면 컬럼을 우측에 고정합니다. */
  fixed?: "right";
  /** 셀 컨테이너에 적용할 추가 CSS 클래스입니다. */
  className?: string;
  /** 정렬·표시 형식을 위한 데이터 유형 힌트입니다. */
  type?: "text" | "number" | "date" | "boolean";
};

/** Excel 내려받기 버튼의 표시와 동작을 정의합니다. */
export type DataGridExcelDownloadAction = {
  /** 내려받기 버튼을 눌렀을 때 실행할 함수입니다. */
  onClick?: () => void;
  /** `true`이면 버튼에 진행 상태를 표시합니다. */
  loading?: boolean;
  /** `true`이면 버튼을 비활성화합니다. */
  disabled?: boolean;
  /** 버튼에 표시할 레이블입니다. */
  label?: string;
  /** 생성 파일에 사용할 기본 파일명입니다. */
  filename?: string;
};

/** 체크박스 기반 행 선택을 제어하는 상태와 콜백입니다. */
export type DataGridSelection<T> = {
  /** 선택된 행 ID 목록입니다. */
  selectedIds: string[];
  /** 특정 행의 선택 여부를 반환합니다. */
  isSelected: (row: T, index: number) => boolean;
  /** 개별 행 선택 상태를 전환합니다. */
  onToggleRow: (row: T, index: number) => void;
  /** 현재 페이지 행의 전체 선택 상태를 전환합니다. */
  onTogglePage: () => void;
  /** 현재 페이지의 모든 행이 선택됐는지 여부입니다. */
  allPageSelected: boolean;
};
