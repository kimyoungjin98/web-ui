import { Button } from "../../button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../select";
import type { DataGridExcelDownloadAction } from "../types";
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
    <div className="flex flex-col gap-2 border-b border-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3 items-center w-full">
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
    <div className="inline-flex w-fit items-center text-primary text-sm font-semibold">
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
    <div className="flex min-w-max items-center gap-2 text-xs font-semibold text-muted-foreground">
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
  return (
    <Select value={String(value)} onValueChange={(v) => onChange?.(Number(v))}>
      <SelectTrigger className="h-8 w-[72px] px-2 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {options.map((o) => (
          <SelectItem key={o} value={String(o)}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
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
        src="https://api.iconify.design/vscode-icons:file-type-excel.svg"
        className="size-5"
        alt=""
      />
    </Button>
  );
}
