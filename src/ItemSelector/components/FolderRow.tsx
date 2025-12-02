import { useRef, useEffect } from "react";
import type { FolderNode, SelectionState } from "../types";
import { useItemSelectorContext } from "../hooks/useItemSelectorContext.ts";

interface FolderRowProps {
  depth: number;
  node: FolderNode;
  selectionState: SelectionState;
  expanded: boolean;
}

export function FolderRow({
  depth,
  node,
  selectionState,
  expanded,
}: FolderRowProps) {
  const { handleToggleFolderExpand, handleToggleFolderRow } =
    useItemSelectorContext();
  const checkboxRef = useRef<HTMLInputElement>(null);
  const paddingLeft = 16 * depth;
  const hasAnyItems = node.allDescendantItems.length > 0;
  const isIndeterminate = selectionState === "indeterminate";

  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  return (
    <div className="folder-row">
      <div
        className="item-selector-row"
        style={{ paddingLeft }}
        onClick={() => handleToggleFolderRow(node.folder.id)}
      >
        <input
          ref={checkboxRef}
          className={`item-selector-checkbox ${isIndeterminate ? "indeterminate" : ""}`}
          type="checkbox"
          checked={selectionState === "checked"}
          data-testid={"folder-selector-checkbox-" + node.folder.id}
          disabled={!hasAnyItems}
          readOnly
        />
        <span className="folder-title">{node.folder.title}</span>
      </div>
      <button
        type="button"
        className={`folder-toggle ${expanded ? "expanded" : ""}`}
        aria-label={expanded ? "Collapse folder" : "Expand folder"}
        onClick={() => handleToggleFolderExpand(node.folder.id)}
        data-testid={"toggle-expander-" + node.folder.id}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2.5 4.5L6 8L9.5 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
