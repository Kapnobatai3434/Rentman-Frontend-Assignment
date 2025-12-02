import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { fetchItemSelectorData } from "../items.ts";

describe("fetchItemSelectorData", () => {
  const mockResponse = {
    folders: {
      columns: ["id", "title", "parent_id"],
      data: [
        [1, "Folder A", null],
        [2, "Folder B", 1],
      ],
    },
    items: {
      columns: ["id", "title", "folder_id"],
      data: [
        [1, "Item 1", 1],
        [2, "Item 2", 2],
      ],
    },
  };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(global, "fetch");
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("should fetch and transform data correctly", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const promise = fetchItemSelectorData();

    await vi.runAllTimersAsync();

    const result = await promise;

    expect(result.folders).toEqual([
      { id: 1, title: "Folder A", parentId: null },
      { id: 2, title: "Folder B", parentId: 1 },
    ]);
    expect(result.items).toEqual([
      { id: 1, title: "Item 1", folderId: 1 },
      { id: 2, title: "Item 2", folderId: 2 },
    ]);
  });

  it("should call fetch with correct URL", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    } as Response);

    const promise = fetchItemSelectorData();
    await vi.runAllTimersAsync();
    await promise;

    expect(global.fetch).toHaveBeenCalledWith("/response.json");
  });

  it("should throw error when response is not ok", async () => {
    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 500,
    } as Response);

    const promise = fetchItemSelectorData();

    const errorPromise = promise.catch((error) => error);

    await vi.runAllTimersAsync();

    const error = await errorPromise;
    expect(error).toBeInstanceOf(Error);
    expect((error as Error).message).toBe("Failed to load item selector data");
  });

  it("should map folder data correctly", async () => {
    const singleFolderResponse = {
      folders: {
        columns: ["id", "title", "parent_id"],
        data: [[5, "Single Folder", 3]],
      },
      items: {
        columns: ["id", "title", "folder_id"],
        data: [],
      },
    };

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(singleFolderResponse),
    } as Response);

    const promise = fetchItemSelectorData();
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result.folders[0]).toEqual({
      id: 5,
      title: "Single Folder",
      parentId: 3,
    });
  });

  it("should map item data correctly", async () => {
    const singleItemResponse = {
      folders: {
        columns: ["id", "title", "parent_id"],
        data: [],
      },
      items: {
        columns: ["id", "title", "folder_id"],
        data: [[10, "Test Item", 7]],
      },
    };

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(singleItemResponse),
    } as Response);

    const promise = fetchItemSelectorData();
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result.items[0]).toEqual({
      id: 10,
      title: "Test Item",
      folderId: 7,
    });
  });

  it("should handle empty data", async () => {
    const emptyResponse = {
      folders: {
        columns: ["id", "title", "parent_id"],
        data: [],
      },
      items: {
        columns: ["id", "title", "folder_id"],
        data: [],
      },
    };

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(emptyResponse),
    } as Response);

    const promise = fetchItemSelectorData();
    await vi.runAllTimersAsync();
    const result = await promise;

    expect(result.folders).toEqual([]);
    expect(result.items).toEqual([]);
  });
});
