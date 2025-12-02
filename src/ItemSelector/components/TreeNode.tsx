import { useItemSelectorContext } from "../hooks/useItemSelectorContext.ts";
import type { FolderNode } from "../types";
import { getFolderSelectionState } from "../tree.ts";
import { FolderRow } from "./FolderRow.tsx";
import { ItemRow } from "./ItemRow.tsx";

export function TreeNode() {
  const { tree, selectedItemIds, expandedFolderIds } = useItemSelectorContext();

  if (!tree) return null;

  const renderFolder = (node: FolderNode, depth: number) => {
    const selectionState = getFolderSelectionState(node, selectedItemIds);
    const expanded = expandedFolderIds.has(node.folder.id);

    return (
      <div key={node.folder.id}>
        <FolderRow
          depth={depth}
          node={node}
          selectionState={selectionState}
          expanded={expanded}
        />
        {expanded && (
          <div>
            {node.childrenFolders.map((child) =>
              renderFolder(child, depth + 1),
            )}
            {node.items.map((item) => (
              <ItemRow
                key={item.id}
                depth={depth + 1}
                id={item.id}
                title={item.title}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="item-selector-list">
      {tree.roots.map((root) => renderFolder(root, 0))}
    </div>
  );
}
