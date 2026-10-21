import { Button } from "../../button/button";
import { Icon } from "../../icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../input/select/select";
import type { DataGridExcelDownloadAction } from "../types";
import { getDataGridPageSizeOptions } from "./page-size";
import { ToolbarSearch } from "./search";

type Excel = DataGridExcelDownloadAction & { onClick: () => void };

type Props = {
  search: string;
  searchable?: boolean;
  selectedCount: number;
  pageSize: number;
  pageSizeOptions: number[];
  excelDownload?: Excel;
  onSearchChange?: (search: string) => void;
  onPageSizeChange?: (pageSize: number) => void;
};

export function DataGridToolbar(p: Props) {
  return (
    <div className="flex flex-col gap-3 border-b border-border bg-card p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
      <div className="flex min-w-0 w-full flex-wrap items-center gap-2 sm:gap-3">
        <ToolbarSearch
          search={p.search}
          searchable={p.searchable}
          onSearchChange={p.onSearchChange}
        />
        <SelectedCountPill count={p.selectedCount} />
      </div>
      <ToolbarActions
        pageSize={p.pageSize}
        pageSizeOptions={p.pageSizeOptions}
        excelDownload={p.excelDownload}
        onPageSizeChange={p.onPageSizeChange}
      />
    </div>
  );
}

function SelectedCountPill({ count }: { count: number }) {
  if (count <= 0) return null;

  return (
    <div className="inline-flex w-fit items-center text-primary-foreground text-sm font-medium">
      {count}개 선택됨
    </div>
  );
}

function ToolbarActions(
  p: Pick<
    Props,
    "pageSize" | "pageSizeOptions" | "excelDownload" | "onPageSizeChange"
  >,
) {
  const excel = p.excelDownload;
  return (
    <div className="flex w-full items-center justify-between gap-2 text-xs font-normal text-muted-foreground sm:w-auto sm:min-w-max sm:justify-end">
      <span className="whitespace-nowrap">페이지당</span>
      <PageSizeSelect
        value={p.pageSize}
        options={p.pageSizeOptions}
        onChange={p.onPageSizeChange}
      />
      {excel ? <ExcelButton action={excel} /> : null}
    </div>
  );
}

function PageSizeSelect({
  value,
  options,
  onChange,
}: {
  value: number;
  options: number[];
  onChange?: (pageSize: number) => void;
}) {
  const resolvedOptions = getDataGridPageSizeOptions(value, [...options]);

  return (
    <div className="flex items-center gap-1">
      <Select
        value={String(value)}
        onValueChange={(nextValue) => onChange?.(Number(nextValue))}
      >
        <SelectTrigger
          aria-label="페이지당 행 수"
          className="h-8 w-[5rem] px-2 text-xs"
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="end">
          {resolvedOptions.map((option) => (
            <SelectItem key={option} value={String(option)}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ExcelButton({ action }: { action: Excel }) {
  const label = action.label ?? "Excel 다운로드";
  return (
    <Button
      title={label}
      type="button"
      size="sm"
      variant="outline"
      disabled={action.loading || action.disabled}
      onClick={action.onClick}
      aria-label={label}
    >
      <img
        src="https://api.iconify.design/vscode-icons/file-type-excel.svg"
        className="size-5"
      />
    </Button>
  );
}
