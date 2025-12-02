import { describe, expect, it } from "vitest";
import { buildFolderTree, getFolderSelectionState } from "../tree.ts";
import type { ItemSelectorData } from "../types";

describe("tree.ts", () => {
  describe("buildFolderTree", () => {
    it("should build a tree from flat folder and item data", () => {
      const data: ItemSelectorData = {
        folders: [
          { id: 1, title: "Root Folder", parentId: null },
          { id: 2, title: "Child Folder", parentId: 1 },
        ],
        items: [
          { id: 1, title: "Item 1", folderId: 1 },
          { id: 2, title: "Item 2", folderId: 2 },
        ],
      };

      const result = buildFolderTree(data);

      expect(result.roots).toHaveLength(1);
      expect(result.roots[0].folder.title).toBe("Root Folder");
      expect(result.roots[0].childrenFolders).toHaveLength(1);
      expect(result.roots[0].childrenFolders[0].folder.title).toBe(
        "Child Folder",
      );
    });

    it("should populate byId map with all folders", () => {
      const data: ItemSelectorData = {
        folders: [
          { id: 1, title: "Folder A", parentId: null },
          { id: 2, title: "Folder B", parentId: null },
          { id: 3, title: "Folder C", parentId: 1 },
        ],
        items: [],
      };

      const result = buildFolderTree(data);

      expect(result.byId.size).toBe(3);
      expect(result.byId.get(1)?.folder.title).toBe("Folder A");
      expect(result.byId.get(2)?.folder.title).toBe("Folder B");
      expect(result.byId.get(3)?.folder.title).toBe("Folder C");
    });

    it("should assign items to their parent folders", () => {
      const data: ItemSelectorData = {
        folders: [{ id: 1, title: "Folder", parentId: null }],
        items: [
          { id: 1, title: "Item A", folderId: 1 },
          { id: 2, title: "Item B", folderId: 1 },
        ],
      };

      const result = buildFolderTree(data);

      expect(result.roots[0].items).toHaveLength(2);
      expect(result.roots[0].items[0].title).toBe("Item A");
      expect(result.roots[0].items[1].title).toBe("Item B");
    });

    it("should handle items with non-existent folder gracefully", () => {
      const data: ItemSelectorData = {
        folders: [{ id: 1, title: "Folder", parentId: null }],
        items: [{ id: 1, title: "Orphan Item", folderId: 999 }],
      };

      const result = buildFolderTree(data);

      expect(result.roots[0].items).toHaveLength(0);
    });

    it("should sort root folders alphabetically", () => {
      const data: ItemSelectorData = {
        folders: [
          { id: 1, title: "Zebra", parentId: null },
          { id: 2, title: "Apple", parentId: null },
          { id: 3, title: "Mango", parentId: null },
        ],
        items: [],
      };

      const result = buildFolderTree(data);

      expect(result.roots[0].folder.title).toBe("Apple");
      expect(result.roots[1].folder.title).toBe("Mango");
      expect(result.roots[2].folder.title).toBe("Zebra");
    });

    it("should sort child folders alphabetically", () => {
      const data: ItemSelectorData = {
        folders: [
          { id: 1, title: "Parent", parentId: null },
          { id: 2, title: "Child Z", parentId: 1 },
          { id: 3, title: "Child A", parentId: 1 },
        ],
        items: [],
      };

      const result = buildFolderTree(data);

      expect(result.roots[0].childrenFolders[0].folder.title).toBe("Child A");
      expect(result.roots[0].childrenFolders[1].folder.title).toBe("Child Z");
    });

    it("should sort items within folders alphabetically", () => {
      const data: ItemSelectorData = {
        folders: [{ id: 1, title: "Folder", parentId: null }],
        items: [
          { id: 1, title: "Zebra Item", folderId: 1 },
          { id: 2, title: "Apple Item", folderId: 1 },
        ],
      };

      const result = buildFolderTree(data);

      expect(result.roots[0].items[0].title).toBe("Apple Item");
      expect(result.roots[0].items[1].title).toBe("Zebra Item");
    });

    it("should populate allDescendantItems with items from nested folders", () => {
      const data: ItemSelectorData = {
        folders: [
          { id: 1, title: "Root", parentId: null },
          { id: 2, title: "Child", parentId: 1 },
          { id: 3, title: "Grandchild", parentId: 2 },
        ],
        items: [
          { id: 1, title: "Root Item", folderId: 1 },
          { id: 2, title: "Child Item", folderId: 2 },
          { id: 3, title: "Grandchild Item", folderId: 3 },
        ],
      };

      const result = buildFolderTree(data);

      expect(result.roots[0].allDescendantItems).toHaveLength(3);
      expect(
        result.roots[0].childrenFolders[0].allDescendantItems,
      ).toHaveLength(2);
      expect(
        result.roots[0].childrenFolders[0].childrenFolders[0]
          .allDescendantItems,
      ).toHaveLength(1);
    });

    it("should handle empty data", () => {
      const data: ItemSelectorData = {
        folders: [],
        items: [],
      };

      const result = buildFolderTree(data);

      expect(result.roots).toHaveLength(0);
      expect(result.byId.size).toBe(0);
    });

    it("should handle multiple root folders with nested children", () => {
      const data: ItemSelectorData = {
        folders: [
          { id: 1, title: "Root A", parentId: null },
          { id: 2, title: "Root B", parentId: null },
          { id: 3, title: "Child of A", parentId: 1 },
          { id: 4, title: "Child of B", parentId: 2 },
        ],
        items: [],
      };

      const result = buildFolderTree(data);

      expect(result.roots).toHaveLength(2);
      expect(result.roots[0].childrenFolders).toHaveLength(1);
      expect(result.roots[1].childrenFolders).toHaveLength(1);
    });

    it("should handle folder with non-existent parent gracefully", () => {
      const data: ItemSelectorData = {
        folders: [{ id: 1, title: "Orphan Folder", parentId: 999 }],
        items: [],
      };

      const result = buildFolderTree(data);

      expect(result.roots).toHaveLength(0);
      expect(result.byId.size).toBe(1);
    });
  });

  describe("getFolderSelectionState", () => {
    it("should return 'unchecked' when no items are selected", () => {
      const node = {
        folder: { id: 1, title: "Folder", parentId: null },
        childrenFolders: [],
        items: [{ id: 1, title: "Item 1", folderId: 1 }],
        allDescendantItems: [{ id: 1, title: "Item 1", folderId: 1 }],
      };

      const result = getFolderSelectionState(node, new Set());

      expect(result).toBe("unchecked");
    });

    it("should return 'checked' when all items are selected", () => {
      const node = {
        folder: { id: 1, title: "Folder", parentId: null },
        childrenFolders: [],
        items: [
          { id: 1, title: "Item 1", folderId: 1 },
          { id: 2, title: "Item 2", folderId: 1 },
        ],
        allDescendantItems: [
          { id: 1, title: "Item 1", folderId: 1 },
          { id: 2, title: "Item 2", folderId: 1 },
        ],
      };

      const result = getFolderSelectionState(node, new Set([1, 2]));

      expect(result).toBe("checked");
    });

    it("should return 'indeterminate' when some items are selected", () => {
      const node = {
        folder: { id: 1, title: "Folder", parentId: null },
        childrenFolders: [],
        items: [
          { id: 1, title: "Item 1", folderId: 1 },
          { id: 2, title: "Item 2", folderId: 1 },
        ],
        allDescendantItems: [
          { id: 1, title: "Item 1", folderId: 1 },
          { id: 2, title: "Item 2", folderId: 1 },
        ],
      };

      const result = getFolderSelectionState(node, new Set([1]));

      expect(result).toBe("indeterminate");
    });

    it("should consider allDescendantItems for nested folders", () => {
      const node = {
        folder: { id: 1, title: "Parent", parentId: null },
        childrenFolders: [],
        items: [],
        allDescendantItems: [
          { id: 1, title: "Nested Item 1", folderId: 2 },
          { id: 2, title: "Nested Item 2", folderId: 2 },
          { id: 3, title: "Nested Item 3", folderId: 3 },
        ],
      };

      const result = getFolderSelectionState(node, new Set([1, 2, 3]));

      expect(result).toBe("checked");
    });

    it("should return 'unchecked' for empty folder", () => {
      const node = {
        folder: { id: 1, title: "Empty", parentId: null },
        childrenFolders: [],
        items: [],
        allDescendantItems: [],
      };

      const result = getFolderSelectionState(node, new Set([1, 2, 3]));

      expect(result).toBe("unchecked");
    });
  });
});
