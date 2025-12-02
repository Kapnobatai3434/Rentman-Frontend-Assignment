import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import {
  useItemSelectorContext,
  ItemSelectorContext,
} from "../useItemSelectorContext.ts";
import type { ItemSelectorContextValue } from "../useItemSelectorContext.ts";

describe("useItemSelectorContext", () => {
  it("should throw error when used outside of provider", () => {
    expect(() => {
      renderHook(() => useItemSelectorContext());
    }).toThrow(
      "useItemSelectorContext must be used within ItemSelectorProvider",
    );
  });

  it("should return context value when used within provider", () => {
    const mockContextValue: ItemSelectorContextValue = {
      tree: null,
      selectedItemIds: new Set([1, 2]),
      expandedFolderIds: new Set([3, 4]),
      handleToggleItem: () => {},
      handleToggleFolderExpand: () => {},
      handleToggleFolderRow: () => {},
      handleClearSelection: () => {},
    };

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ItemSelectorContext.Provider value={mockContextValue}>
        {children}
      </ItemSelectorContext.Provider>
    );

    const { result } = renderHook(() => useItemSelectorContext(), { wrapper });

    expect(result.current).toBe(mockContextValue);
    expect(result.current.selectedItemIds).toEqual(new Set([1, 2]));
    expect(result.current.expandedFolderIds).toEqual(new Set([3, 4]));
  });
});
