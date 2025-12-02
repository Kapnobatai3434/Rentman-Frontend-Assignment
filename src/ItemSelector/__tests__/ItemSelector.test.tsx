import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ItemSelector } from "../index.tsx";
import * as useItemSelectorQueryModule from "../hooks/useItemSelectorQuery.ts";

vi.mock("../hooks/useItemSelectorQuery.ts", () => ({
  useItemSelectorQuery: vi.fn(),
}));

describe("ItemSelector", () => {
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

  it("should show loading state when data is loading", () => {
    vi.mocked(useItemSelectorQueryModule.useItemSelectorQuery).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      error: null,
    } as ReturnType<typeof useItemSelectorQueryModule.useItemSelectorQuery>);

    render(<ItemSelector />, { wrapper });

    expect(screen.getByText("Loading items…")).toBeInTheDocument();
  });

  it("should show loading state when data is not available yet", () => {
    vi.mocked(useItemSelectorQueryModule.useItemSelectorQuery).mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useItemSelectorQueryModule.useItemSelectorQuery>);

    render(<ItemSelector />, { wrapper });

    expect(screen.getByText("Loading items…")).toBeInTheDocument();
  });

  it("should show error message when there is an error", () => {
    vi.mocked(useItemSelectorQueryModule.useItemSelectorQuery).mockReturnValue({
      data: {
        folders: [{ id: 1, title: "Folder", parentId: null }],
        items: [],
      },
      isLoading: false,
      isError: true,
      error: new Error("Network error"),
    } as unknown as ReturnType<
      typeof useItemSelectorQueryModule.useItemSelectorQuery
    >);

    render(<ItemSelector />, { wrapper });

    expect(
      screen.getByText("Error loading items: Network error"),
    ).toBeInTheDocument();
  });

  it("should render tree and footer when data is loaded", () => {
    vi.mocked(useItemSelectorQueryModule.useItemSelectorQuery).mockReturnValue({
      data: {
        folders: [{ id: 1, title: "Test Folder", parentId: null }],
        items: [{ id: 1, title: "Test Item", folderId: 1 }],
      },
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useItemSelectorQueryModule.useItemSelectorQuery>);

    render(<ItemSelector />, { wrapper });

    expect(screen.getByText("Test Folder")).toBeInTheDocument();
    expect(screen.getByText("Clear selection")).toBeInTheDocument();
  });

  it("should render items within expanded folders", () => {
    vi.mocked(useItemSelectorQueryModule.useItemSelectorQuery).mockReturnValue({
      data: {
        folders: [{ id: 1, title: "Folder A", parentId: null }],
        items: [{ id: 1, title: "Item in Folder A", folderId: 1 }],
      },
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useItemSelectorQueryModule.useItemSelectorQuery>);

    render(<ItemSelector />, { wrapper });

    expect(screen.getByText("Folder A")).toBeInTheDocument();
  });
});
