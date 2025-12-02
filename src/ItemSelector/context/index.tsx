import { useState, useMemo, useCallback } from "react";
import {
  getFolderSelectionState,
  type BuildTreeResult,
} from "../tree.ts";
import { ItemSelectorContext } from "../hooks/useItemSelectorContext.ts";

interface ItemSelectorProviderProps {
  tree: BuildTreeResult | null;
  children: React.ReactNode;
}

export function ItemSelectorProvider({
  tree,
  children,
}: ItemSelectorProviderProps) {
  const [selectedItemIds, setSelectedItemIds] = useState<Set<number>>(
    new Set(),
  );
  const [expandedFolderIds, setExpandedFolderIds] = useState<Set<number>>(
    () => {
      if (!tree) return new Set();
      const allIds = new Set<number>();
      for (const id of tree.byId.keys()) {
        allIds.add(id);
      }
      return allIds;
    },
  );

  const handleToggleItem = useCallback((itemId: number) => {
    setSelectedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  const handleToggleFolderExpand = useCallback((folderId: number) => {
    setExpandedFolderIds((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  }, []);

  const handleToggleFolderRow = useCallback(
    (folderId: number) => {
      if (!tree) return;
      const node = tree.byId.get(folderId);
      if (!node) return;

      setSelectedItemIds((prev) => {
        const next = new Set(prev);
        const state = getFolderSelectionState(node, next);
        const ids = node.allDescendantItems.map((item) => item.id);

        if (state === "checked") {
          for (const id of ids) {
            next.delete(id);
          }
        } else {
          for (const id of ids) {
            next.add(id);
          }
        }

        return next;
      });
    },
    [tree],
  );

  const handleClearSelection = useCallback(() => {
    setSelectedItemIds(new Set());
  }, []);

  const value = useMemo(
    () => ({
      tree,
      selectedItemIds,
      expandedFolderIds,
      handleToggleItem,
      handleToggleFolderExpand,
      handleToggleFolderRow,
      handleClearSelection,
    }),
    [
      tree,
      selectedItemIds,
      expandedFolderIds,
      handleToggleItem,
      handleToggleFolderExpand,
      handleToggleFolderRow,
      handleClearSelection,
    ],
  );

  return (
    <ItemSelectorContext.Provider value={value}>
      {children}
    </ItemSelectorContext.Provider>
  );
}
