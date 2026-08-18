import type * as React from "react";
import type {
  DataGridColumn,
  DataGridColumnDef,
  DataGridDensity,
  DataGridExcelDownloadAction,
  DataGridSelection,
  DataGridSort,
} from "./types";

export type DataGridProps<T extends object> = {
  /** 표 영역을 설명하는 접근성 레이블입니다. */
  ariaLabel?: string;
  /** 최상위 DataGrid 컨테이너에 적용할 추가 CSS 클래스입니다. */
  className?: string;
  /** React 렌더링용 컬럼 정의입니다. `columnDefs`보다 우선합니다. */
  columns?: DataGridColumn<T>[];
  /** JSON 친화적인 컬럼 정의입니다. 내부에서 `columns`로 변환됩니다. */
  columnDefs?: DataGridColumnDef<T>[];
  /** 행과 셀의 표시 밀도입니다. */
  density?: DataGridDensity;
  /** 표에 렌더링할 행 배열입니다. `rowData`보다 우선합니다. */
  rows?: T[];
  /** AG Grid 호환 명칭의 행 배열 별칭입니다. */
  rowData?: T[];
  /** 각 행의 안정적인 식별자를 반환하는 함수입니다. */
  getRowId?: (row: T, index: number) => string;
  /** 데이터를 불러오는 동안 스켈레톤 행을 표시할지 여부입니다. */
  loading?: boolean;
  /** 표시할 행이 없을 때 보여 줄 안내 문구입니다. */
  emptyMessage?: string;
  /** 서버 기준 전체 행 수입니다. */
  total: number;
  /** 현재 페이지 번호입니다. 1부터 시작합니다. */
  page: number;
  /** 현재 페이지에서 표시할 행 수입니다. */
  pageSize: number;
  /** 기본 페이지 크기 10, 20, 50, 100에 추가할 정수 목록입니다. */
  pageSizeOptions?: number[];
  /** 현재 서버 정렬 상태입니다. */
  sort: DataGridSort;
  /** 검색 입력의 제어 값입니다. */
  search?: string;
  /** 검색 도구 모음 표시 여부입니다. */
  searchable?: boolean;
  /** 가로 스크롤이 필요한 경우 메인 표에 적용할 최소 너비입니다. */
  minTableWidth?: string;
  /** `true`이면 헤더와 행의 셀 경계선을 표시합니다. 기본값은 `false`입니다. */
  gridLines?: boolean;
  /** Excel 내려받기 버튼의 동작과 상태입니다. `false`면 버튼을 숨깁니다. */
  excelDownload?: DataGridExcelDownloadAction | false;
  /** 행 선택 상태와 선택 토글 동작입니다. */
  selection?: DataGridSelection<T>;
  /** 도구 모음 표시 여부입니다. */
  toolbar?: boolean;
  /** `toolbar`의 호환 별칭입니다. 명시하면 우선 적용됩니다. */
  showToolbar?: boolean;
  /** 페이지네이션 영역 표시 여부입니다. */
  pagination?: boolean;
  /** 각 행에 조건부 CSS 클래스를 적용하는 함수입니다. */
  rowClassName?: (row: T, index: number) => string;
  /** 사용자가 페이지를 변경했을 때 호출됩니다. */
  onPageChange?: (page: number) => void;
  /** 사용자가 페이지 크기를 변경했을 때 호출됩니다. */
  onPageSizeChange?: (pageSize: number) => void;
  /** 사용자가 정렬을 변경했을 때 호출됩니다. */
  onSortChange?: (sort: DataGridSort) => void;
  /** 사용자가 검색어를 변경했을 때 호출됩니다. */
  onSearchChange?: (search: string) => void;
  /** 행의 비인터랙티브 영역을 클릭했을 때 호출됩니다. */
  onRowClick?: (row: T, index: number) => void;
  /** 행 우측 액션 영역에 렌더링할 콘텐츠를 반환합니다. */
  rowActions?: (row: T, index: number) => React.ReactNode;
};

export type ResolvedDataGridProps<T extends object> = DataGridProps<T> & {
  /** `columns` 또는 `columnDefs`에서 해석된 필수 컬럼 배열입니다. */
  columns: DataGridColumn<T>[];
  /** 기본 구현까지 적용된 행 식별자 함수입니다. */
  getRowId: (row: T, index: number) => string;
  /** `rows` 또는 `rowData`에서 해석된 필수 행 배열입니다. */
  rows: T[];
};
