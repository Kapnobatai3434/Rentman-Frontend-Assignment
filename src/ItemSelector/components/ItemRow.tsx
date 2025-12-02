import { useItemSelectorContext } from "../hooks/useItemSelectorContext.ts";

interface ItemRowProps {
  depth: number;
  id: number;
  title: string;
}

export function ItemRow({ depth, id, title }: ItemRowProps) {
  const { selectedItemIds, handleToggleItem } = useItemSelectorContext();
  const paddingLeft = 16 * depth;
  const selected = selectedItemIds.has(id);

  return (
    <div
      className="item-selector-row item-row"
      style={{ paddingLeft }}
      onClick={() => handleToggleItem(id)}
    >
      <input
        className="item-selector-checkbox"
        type="checkbox"
        data-testid={"item-selector-checkbox-" + id}
        checked={selected}
        readOnly
      />
      <span className="item-title">{title}</span>
    </div>
  );
}
