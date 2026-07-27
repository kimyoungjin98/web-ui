import { Button } from "../button/button";
import Icon from "../icon";

type Props = {
  firstItem: number;
  lastItem: number;
  total: number;
  page: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
};

export function DataGridPagination(p: Props) {
  return (
    <div className="-mt-px flex flex-col gap-3 border-t border-border bg-card px-3 py-3 text-sm font-semibold text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-4">
      <span className="text-center sm:text-left">
        {p.firstItem}-{p.lastItem} / {p.total}
      </span>
      <div className="flex w-full items-center gap-2 sm:w-auto">
        <PageButton
          disabled={p.page <= 1}
          icon="lucide:chevron-left"
          label="이전"
          onClick={() => p.onPageChange?.(Math.max(1, p.page - 1))}
        />
        <span className="min-w-16 flex-1 text-center text-base-content sm:flex-none">
          {p.page} / {p.pageCount}
        </span>
        <PageButton
          disabled={p.page >= p.pageCount}
          icon="lucide:chevron-right"
          iconAfter
          label="다음"
          onClick={() => p.onPageChange?.(Math.min(p.pageCount, p.page + 1))}
        />
      </div>
    </div>
  );
}

function PageButton({
  disabled,
  icon,
  iconAfter,
  label,
  onClick,
}: {
  disabled: boolean;
  icon: string;
  iconAfter?: boolean;
  label: string;
  onClick: () => void;
}) {
  const ico = <Icon name={icon} className="size-4" />;
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="h-10 flex-1 sm:h-8 sm:flex-none"
      disabled={disabled}
      onClick={onClick}
    >
      {iconAfter ? null : ico}
      {label}
      {iconAfter ? ico : null}
    </Button>
  );
}
