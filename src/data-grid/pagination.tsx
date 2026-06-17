import { Button } from "../button";
import Icon from "../icon";

type Props = {
  firstItem: number; lastItem: number; total: number; page: number; pageCount: number;
  onPageChange?: (page: number) => void;
};

export function DataGridPagination(p: Props) {
  return <div className="flex flex-col gap-3 border-t border-border bg-white px-4 py-3 text-sm font-semibold text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
    <span>{p.firstItem}-{p.lastItem} / {p.total}</span>
    <div className="flex items-center gap-2">
      <PageButton disabled={p.page <= 1} icon="lucide:chevron-left" label="이전" onClick={() => p.onPageChange?.(Math.max(1, p.page - 1))} />
      <span className="min-w-16 text-center text-foreground">{p.page} / {p.pageCount}</span>
      <PageButton disabled={p.page >= p.pageCount} icon="lucide:chevron-right" iconAfter label="다음" onClick={() => p.onPageChange?.(Math.min(p.pageCount, p.page + 1))} />
    </div>
  </div>;
}

function PageButton({ disabled, icon, iconAfter, label, onClick }: { disabled: boolean; icon: string; iconAfter?: boolean; label: string; onClick: () => void }) {
  const ico = <Icon name={icon} className="size-4" />;
  return <Button type="button" variant="outline" size="sm" disabled={disabled} onClick={onClick}>{iconAfter ? null : ico}{label}{iconAfter ? ico : null}</Button>;
}
