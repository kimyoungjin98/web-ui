import * as React from "react";

import { Button } from "../../button/button";
import { FormItem } from "../../form/form-layout";
import { Input } from "../../input/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../input/select/select";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../../popover";
import type { DataGridExcelDownloadAction } from "../types";
import { getDataGridPageSizeOptions, parseDataGridPageSize } from "./page-size";
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
    <div className="inline-flex w-fit items-center text-primary-foreground text-sm font-semibold">
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
    <div className="flex w-full items-center justify-between gap-2 text-xs font-semibold text-muted-foreground sm:w-auto sm:min-w-max sm:justify-end">
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
  const inputId = React.useId();
  const errorId = React.useId();
  const [addedOptions, setAddedOptions] = React.useState<number[]>([]);
  const [addOpen, setAddOpen] = React.useState(false);
  const [draft, setDraft] = React.useState("");
  const [error, setError] = React.useState("");
  const resolvedOptions = getDataGridPageSizeOptions(value, [
    ...options,
    ...addedOptions,
  ]);

  const addOption = () => {
    const pageSize = parseDataGridPageSize(draft);
    if (pageSize === null) {
      setError("1 이상의 정수를 입력하세요.");
      return;
    }
    if (resolvedOptions.includes(pageSize)) {
      setError("이미 등록된 옵션입니다.");
      return;
    }

    setAddedOptions((current) => [...current, pageSize]);
    setDraft("");
    setError("");
    setAddOpen(false);
  };

  return (
    <div className="flex items-center gap-1">
      <Select
        value={String(value)}
        onValueChange={(nextValue) => onChange?.(Number(nextValue))}
      >
        <SelectTrigger
          aria-label="페이지당 행 수"
          className="h-8 w-[72px] px-2 text-xs"
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
      <Popover
        open={addOpen}
        onOpenChange={(open) => {
          setAddOpen(open);
          if (!open) {
            setDraft("");
            setError("");
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            type="button"
            size="sm"
            variant="outline"
            aria-label="페이지 크기 옵션 추가"
            disabled={!onChange}
          >
            추가
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="flex flex-col gap-4">
          <PopoverHeader>
            <PopoverTitle>페이지 크기 옵션 추가</PopoverTitle>
            <PopoverDescription>
              추가한 숫자는 페이지 크기 목록에서 선택할 수 있습니다.
            </PopoverDescription>
          </PopoverHeader>
          <FormItem
            label="추가할 페이지 크기"
            htmlFor={inputId}
            error={error || undefined}
            errorId={error ? errorId : undefined}
          >
            <div className="flex items-center gap-2">
              <Input
                id={inputId}
                value={draft}
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                size="sm"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? errorId : undefined}
                onChange={(event) => {
                  setDraft(event.target.value);
                  setError("");
                }}
                onKeyDown={(event) => {
                  if (event.key !== "Enter") return;
                  event.preventDefault();
                  addOption();
                }}
              />
              <Button type="button" size="sm" onClick={addOption}>
                등록
              </Button>
            </div>
          </FormItem>
        </PopoverContent>
      </Popover>
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
        src="https://api.iconify.design/vscode-icons:file-type-excel.svg"
        className="size-5"
        alt=""
      />
    </Button>
  );
}
