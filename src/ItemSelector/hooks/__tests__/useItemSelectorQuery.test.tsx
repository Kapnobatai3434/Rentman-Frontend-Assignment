import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useItemSelectorQuery } from "../useItemSelectorQuery.ts";
import * as itemsApi from "../../../api/items.ts";

vi.mock("../../api/items.ts", () => ({
  fetchItemSelectorData: vi.fn(),
}));

describe("useItemSelectorQuery", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it("should fetch item selector data successfully", async () => {
    const mockData = {
      folders: [{ id: 1, title: "Folder", parentId: null }],
      items: [{ id: 1, title: "Item", folderId: 1 }],
    };

    vi.mocked(itemsApi.fetchItemSelectorData).mockResolvedValue(mockData);

    const { result } = renderHook(() => useItemSelectorQuery(), { wrapper });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
    expect(itemsApi.fetchItemSelectorData).toHaveBeenCalledTimes(1);
  });

  it("should handle fetch error", async () => {
    const mockError = new Error("Failed to fetch");
    vi.mocked(itemsApi.fetchItemSelectorData).mockRejectedValue(mockError);

    const { result } = renderHook(() => useItemSelectorQuery(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(mockError);
  });

  it("should use correct query key", async () => {
    const mockData = { folders: [], items: [] };
    vi.mocked(itemsApi.fetchItemSelectorData).mockResolvedValue(mockData);

    renderHook(() => useItemSelectorQuery(), { wrapper });

    await waitFor(() => {
      expect(queryClient.getQueryData(["item-selector"])).toBeDefined();
    });
  });
});
