import { createContext, useContext } from "react";
import type { BuildTreeResult } from "../tree.ts";

export interface ItemSelectorContextValue {
  tree: BuildTreeResult | null;
  selectedItemIds: Set<number>;
  expandedFolderIds: Set<number>;
  handleToggleItem: (itemId: number) => void;
  handleToggleFolderExpand: (folderId: number) => void;
  handleToggleFolderRow: (folderId: number) => void;
  handleClearSelection: () => void;
}

export const ItemSelectorContext =
  createContext<ItemSelectorContextValue | null>(null);

export function useItemSelectorContext() {
  const context = useContext(ItemSelectorContext);
  if (!context) {
    throw new Error(
      "useItemSelectorContext must be used within ItemSelectorProvider",
    );
  }
  return context;
}
