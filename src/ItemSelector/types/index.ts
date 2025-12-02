export type FolderColumns = ["id", "title", "parent_id"];

export interface FolderRecord {
  id: number;
  title: string;
  parentId: number | null;
}

export type ItemColumns = ["id", "title", "folder_id"];

export interface ItemRecord {
  id: number;
  title: string;
  folderId: number;
}

export interface ItemSelectorResponseRaw {
  folders: {
    columns: FolderColumns;
    data: [number, string, number | null][];
  };
  items: {
    columns: ItemColumns;
    data: [number, string, number][];
  };
}

export interface ItemSelectorData {
  folders: FolderRecord[];
  items: ItemRecord[];
}

export type SelectionState = "unchecked" | "checked" | "indeterminate";

export interface FolderNode {
  folder: FolderRecord;
  childrenFolders: FolderNode[];
  items: ItemRecord[];
  allDescendantItems: ItemRecord[];
}
