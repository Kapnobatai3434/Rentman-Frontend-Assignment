import { useMemo } from "react";
import { useItemSelectorContext } from "../hooks/useItemSelectorContext.ts";

export function Footer() {
  const { selectedItemIds, handleClearSelection } = useItemSelectorContext();

  const selectedIdsList = useMemo(
    () =>
      Array.from(selectedItemIds)
        .sort((a, b) => a - b)
        .join(", "),
    [selectedItemIds],
  );

  return (
    <div className="item-selector-footer">
      <div>Selected item IDs: {selectedIdsList}</div>
      <button
        type="button"
        className="clear-selection-button"
        data-testid="clear-selection"
        onClick={handleClearSelection}
      >
        Clear selection
      </button>
    </div>
  );
}
