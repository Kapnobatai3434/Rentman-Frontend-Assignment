import { describe, expect, it } from "vitest";
import { screen, render } from "@testing-library/react";
import { renderWithProviders, userEvent } from "../../test-utils.tsx";
import { TreeNode } from "../components/TreeNode.tsx";
import { ItemSelectorProvider } from "../context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

describe("TreeNode", () => {
  it("should render and match snapshot", () => {
    const { asFragment } = renderWithProviders(<TreeNode />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("should return null when tree is null", () => {
    const client = new QueryClient();
    const { container } = render(
      <ItemSelectorProvider tree={null}>
        <QueryClientProvider client={client}>
          <TreeNode />
        </QueryClientProvider>
      </ItemSelectorProvider>,
    );
    expect(container.querySelector(".item-selector-list")).toBeNull();
  });

  it("should render root folders", () => {
    renderWithProviders(<TreeNode />);
    expect(screen.getByText("Audio")).toBeInTheDocument();
    expect(screen.getByText("Rigging")).toBeInTheDocument();
  });

  it("should render nested folders when expanded", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TreeNode />);

    const audioToggle = screen.getByTestId("toggle-expander-1");
    await user.click(audioToggle);

    expect(screen.getByText("Speakers")).toBeInTheDocument();
  });

  it("should render items within expanded folders", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TreeNode />);

    const audioToggle = screen.getByTestId("toggle-expander-1");
    await user.click(audioToggle);

    expect(screen.getByText("Audio item 1")).toBeInTheDocument();
  });

  it("should hide children when folder is collapsed", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TreeNode />);

    const audioToggle = screen.getByTestId("toggle-expander-1");
    await user.click(audioToggle);
    expect(screen.getByText("Speakers")).toBeInTheDocument();

    await user.click(audioToggle);
    expect(screen.queryByText("Speakers")).not.toBeInTheDocument();
  });

  it("should render deeply nested folders", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TreeNode />);

    await user.click(screen.getByTestId("toggle-expander-1"));
    await user.click(screen.getByTestId("toggle-expander-4"));

    expect(screen.getByText("Active speakers")).toBeInTheDocument();
    expect(screen.getByText("Passive speakers")).toBeInTheDocument();
  });

  it("should render items in deeply nested folders", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TreeNode />);

    await user.click(screen.getByTestId("toggle-expander-1"));
    await user.click(screen.getByTestId("toggle-expander-4"));
    await user.click(screen.getByTestId("toggle-expander-10"));

    expect(screen.getByText("Active Speakers Item 1")).toBeInTheDocument();
  });

  it("should allow selecting items in the tree", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TreeNode />);

    await user.click(screen.getByTestId("toggle-expander-1"));

    const itemRow = screen.getByText("Audio item 1").closest(".item-selector-row");
    await user.click(itemRow!);

    const checkbox = screen.getByTestId("item-selector-checkbox-5");
    expect(checkbox).toBeChecked();
  });
});
