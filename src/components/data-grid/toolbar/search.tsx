import { Input } from "../../input";
import Icon from "../../icon";
import { useToolbarSearch } from "./use-toolbar-search";

type Props = {
  search: string;
  searchable?: boolean;
  onSearchChange?: (search: string) => void;
};

export function ToolbarSearch({
  search,
  searchable = true,
  onSearchChange,
}: Props) {
  const field = useToolbarSearch(search, onSearchChange);
  if (!searchable) return <div className="hidden sm:block" />;

  return (
    <div className="block w-full sm:max-w-[25rem]">
      <label htmlFor={field.id} className="sr-only">
        검색
      </label>
      <Input
        id={field.id}
        ref={field.ref}
        defaultValue={search}
        onChange={field.onChange}
        placeholder="검색"
        startIcon={<Icon name="mdi:search" className="size-4" />}
      />
    </div>
  );
}
