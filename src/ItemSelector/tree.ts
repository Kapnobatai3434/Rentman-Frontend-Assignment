import type {
  FolderNode,
  ItemRecord,
  ItemSelectorData,
  SelectionState,
} from "./types";

export interface BuildTreeResult {
  roots: FolderNode[];
  byId: Map<number, FolderNode>;
}

export function buildFolderTree(data: ItemSelectorData): BuildTreeResult {
  const byId = new Map<number, FolderNode>();

  for (const folder of data.folders) {
    byId.set(folder.id, {
      folder,
      childrenFolders: [],
      items: [],
      allDescendantItems: [],
    });
  }

  for (const item of data.items) {
    const parent = byId.get(item.folderId);
    if (parent) {
      parent.items.push(item);
    }
  }

  const roots: FolderNode[] = [];

  for (const node of byId.values()) {
    if (node.folder.parentId == null) {
      roots.push(node);
    } else {
      const parent = byId.get(node.folder.parentId);
      if (parent) {
        parent.childrenFolders.push(node);
      }
    }
  }

  const sortNode = (node: FolderNode) => {
    node.childrenFolders.sort((a, b) =>
      a.folder.title.localeCompare(b.folder.title),
    );
    node.items.sort((a, b) => a.title.localeCompare(b.title));
    node.childrenFolders.forEach(sortNode);
  };

  roots.sort((a, b) => a.folder.title.localeCompare(b.folder.title));
  roots.forEach(sortNode);

  const populateDescendants = (node: FolderNode): ItemRecord[] => {
    const descendants = [
      ...node.items,
      ...node.childrenFolders.flatMap(populateDescendants),
    ];
    node.allDescendantItems = descendants;
    return descendants;
  };
  roots.forEach(populateDescendants);

  return { roots, byId };
}

export function getFolderSelectionState(
  node: FolderNode,
  selectedItemIds: Set<number>,
): SelectionState {
  const allItems = node.allDescendantItems;
  const selectedCount = allItems.reduce(
    (count, item) => (selectedItemIds.has(item.id) ? count + 1 : count),
    0,
  );

  if (selectedCount === 0) return "unchecked";
  if (selectedCount === allItems.length) return "checked";
  return "indeterminate";
}
