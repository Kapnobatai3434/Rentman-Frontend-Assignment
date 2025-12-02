import { describe, expect, it } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { ItemSelectorProvider } from "../index.tsx";
import { useItemSelectorContext } from "../../hooks/useItemSelectorContext.ts";
import type { BuildTreeResult } from "../../tree.ts";
import type { FolderNode } from "../../types";

const createMockTree = (): BuildTreeResult => {
  const folderNode: FolderNode = {
    folder: { id: 1, title: "Test Folder", parentId: null },
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

  const byId = new Map<number, FolderNode>();
  byId.set(1, folderNode);

  return {
    roots: [folderNode],
    byId,
  };
};

describe("ItemSelectorProvider", () => {
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ItemSelectorProvider tree={createMockTree()}>
      {children}
    </ItemSelectorProvider>
  );

  const nullTreeWrapper = ({ children }: { children: React.ReactNode }) => (
    <ItemSelectorProvider tree={null}>{children}</ItemSelectorProvider>
  );

  it("should provide tree to context", () => {
    const { result } = renderHook(() => useItemSelectorContext(), { wrapper });
    expect(result.current.tree).not.toBeNull();
    expect(result.current.tree?.roots).toHaveLength(1);
  });

  it("should initialize with empty selectedItemIds", () => {
    const { result } = renderHook(() => useItemSelectorContext(), { wrapper });
    expect(result.current.selectedItemIds.size).toBe(0);
  });

  it("should initialize expandedFolderIds from tree byId keys", () => {
    const { result } = renderHook(() => useItemSelectorContext(), { wrapper });
    expect(result.current.expandedFolderIds.has(1)).toBe(true);
  });

  it("should initialize with empty expandedFolderIds when tree is null", () => {
    const { result } = renderHook(() => useItemSelectorContext(), {
      wrapper: nullTreeWrapper,
    });
    expect(result.current.expandedFolderIds.size).toBe(0);
  });

  describe("handleToggleItem", () => {
    it("should add item to selection when not selected", () => {
      const { result } = renderHook(() => useItemSelectorContext(), {
        wrapper,
      });

      act(() => {
        result.current.handleToggleItem(1);
      });

      expect(result.current.selectedItemIds.has(1)).toBe(true);
    });

    it("should remove item from selection when already selected", () => {
      const { result } = renderHook(() => useItemSelectorContext(), {
        wrapper,
      });

      act(() => {
        result.current.handleToggleItem(1);
      });
      expect(result.current.selectedItemIds.has(1)).toBe(true);

      act(() => {
        result.current.handleToggleItem(1);
      });
      expect(result.current.selectedItemIds.has(1)).toBe(false);
    });
  });

  describe("handleToggleFolderExpand", () => {
    it("should remove folder from expanded when already expanded", () => {
      const { result } = renderHook(() => useItemSelectorContext(), {
        wrapper,
      });

      expect(result.current.expandedFolderIds.has(1)).toBe(true);

      act(() => {
        result.current.handleToggleFolderExpand(1);
      });

      expect(result.current.expandedFolderIds.has(1)).toBe(false);
    });

    it("should add folder to expanded when collapsed", () => {
      const { result } = renderHook(() => useItemSelectorContext(), {
        wrapper,
      });

      act(() => {
        result.current.handleToggleFolderExpand(1);
      });
      expect(result.current.expandedFolderIds.has(1)).toBe(false);

      act(() => {
        result.current.handleToggleFolderExpand(1);
      });
      expect(result.current.expandedFolderIds.has(1)).toBe(true);
    });
  });

  describe("handleToggleFolderRow", () => {
    it("should select all items in folder when none are selected", () => {
      const { result } = renderHook(() => useItemSelectorContext(), {
        wrapper,
      });

      act(() => {
        result.current.handleToggleFolderRow(1);
      });

      expect(result.current.selectedItemIds.has(1)).toBe(true);
      expect(result.current.selectedItemIds.has(2)).toBe(true);
    });

    it("should deselect all items in folder when all are selected", () => {
      const { result } = renderHook(() => useItemSelectorContext(), {
        wrapper,
      });

      act(() => {
        result.current.handleToggleFolderRow(1);
      });
      expect(result.current.selectedItemIds.size).toBe(2);

      act(() => {
        result.current.handleToggleFolderRow(1);
      });
      expect(result.current.selectedItemIds.size).toBe(0);
    });

    it("should select all items when some are selected (indeterminate state)", () => {
      const { result } = renderHook(() => useItemSelectorContext(), {
        wrapper,
      });

      act(() => {
        result.current.handleToggleItem(1);
      });
      expect(result.current.selectedItemIds.size).toBe(1);

      act(() => {
        result.current.handleToggleFolderRow(1);
      });
      expect(result.current.selectedItemIds.has(1)).toBe(true);
      expect(result.current.selectedItemIds.has(2)).toBe(true);
    });

    it("should do nothing when tree is null", () => {
      const { result } = renderHook(() => useItemSelectorContext(), {
        wrapper: nullTreeWrapper,
      });

      act(() => {
        result.current.handleToggleFolderRow(1);
      });

      expect(result.current.selectedItemIds.size).toBe(0);
    });

    it("should do nothing when folder is not found", () => {
      const { result } = renderHook(() => useItemSelectorContext(), {
        wrapper,
      });

      act(() => {
        result.current.handleToggleFolderRow(999);
      });

      expect(result.current.selectedItemIds.size).toBe(0);
    });
  });

  describe("handleClearSelection", () => {
    it("should clear all selected items", () => {
      const { result } = renderHook(() => useItemSelectorContext(), {
        wrapper,
      });

      act(() => {
        result.current.handleToggleItem(1);
        result.current.handleToggleItem(2);
      });
      expect(result.current.selectedItemIds.size).toBe(2);

      act(() => {
        result.current.handleClearSelection();
      });
      expect(result.current.selectedItemIds.size).toBe(0);
    });
  });
});
