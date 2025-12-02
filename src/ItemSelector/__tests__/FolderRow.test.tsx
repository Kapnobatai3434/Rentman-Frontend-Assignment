import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders, userEvent } from "../../test-utils.tsx";
import { FolderRow } from "../components/FolderRow.tsx";
import { tree } from "../../__mocks__/treeMock.ts";
import type { FolderNode } from "../types";

const sampleFolderNode = tree.roots[0];

const emptyFolderNode: FolderNode = {
  folder: { id: 99, title: "Empty Folder", parentId: null },
  childrenFolders: [],
  items: [],
  allDescendantItems: [],
};

describe("FolderRow", () => {
  it("should render and match snapshot", () => {
    const { asFragment } = renderWithProviders(
      <FolderRow
        depth={0}
        node={sampleFolderNode}
        selectionState="checked"
        expanded={true}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render with correct padding based on depth", () => {
    renderWithProviders(
      <FolderRow depth={2} node={sampleFolderNode} selectionState="unchecked" expanded={false} />,
    );
    const row = screen.getByText("Audio").closest(".item-selector-row");
    expect(row).toHaveStyle({ paddingLeft: "32px" });
  });

  it("should display folder title", () => {
    renderWithProviders(
      <FolderRow depth={0} node={sampleFolderNode} selectionState="unchecked" expanded={false} />,
    );
    expect(screen.getByText("Audio")).toBeInTheDocument();
  });

  it("should show checkbox as checked when selectionState is checked", () => {
    renderWithProviders(
      <FolderRow depth={0} node={sampleFolderNode} selectionState="checked" expanded={false} />,
    );
    const checkbox = screen.getByTestId("folder-selector-checkbox-1");
    expect(checkbox).toBeChecked();
  });

  it("should show checkbox as unchecked when selectionState is unchecked", () => {
    renderWithProviders(
      <FolderRow depth={0} node={sampleFolderNode} selectionState="unchecked" expanded={false} />,
    );
    const checkbox = screen.getByTestId("folder-selector-checkbox-1");
    expect(checkbox).not.toBeChecked();
  });

  it("should set indeterminate state on checkbox when selectionState is indeterminate", () => {
    renderWithProviders(
      <FolderRow depth={0} node={sampleFolderNode} selectionState="indeterminate" expanded={false} />,
    );
    const checkbox = screen.getByTestId("folder-selector-checkbox-1") as HTMLInputElement;
    expect(checkbox.indeterminate).toBe(true);
    expect(checkbox).toHaveClass("indeterminate");
  });

  it("should disable checkbox when folder has no items", () => {
    renderWithProviders(
      <FolderRow depth={0} node={emptyFolderNode} selectionState="unchecked" expanded={false} />,
    );
    const checkbox = screen.getByTestId("folder-selector-checkbox-99");
    expect(checkbox).toBeDisabled();
  });

  it("should enable checkbox when folder has items", () => {
    renderWithProviders(
      <FolderRow depth={0} node={sampleFolderNode} selectionState="unchecked" expanded={false} />,
    );
    const checkbox = screen.getByTestId("folder-selector-checkbox-1");
    expect(checkbox).not.toBeDisabled();
  });

  it("should toggle folder expansion when expand button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <FolderRow depth={0} node={sampleFolderNode} selectionState="unchecked" expanded={false} />,
    );

    const toggleButton = screen.getByTestId("toggle-expander-1");
    expect(toggleButton).toHaveAttribute("aria-label", "Expand folder");

    await user.click(toggleButton);
  });

  it("should show collapse aria-label when expanded", () => {
    renderWithProviders(
      <FolderRow depth={0} node={sampleFolderNode} selectionState="unchecked" expanded={true} />,
    );
    const toggleButton = screen.getByTestId("toggle-expander-1");
    expect(toggleButton).toHaveAttribute("aria-label", "Collapse folder");
    expect(toggleButton).toHaveClass("expanded");
  });

  it("should call handleToggleFolderRow when row is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <FolderRow depth={0} node={sampleFolderNode} selectionState="unchecked" expanded={false} />,
    );

    const row = screen.getByText("Audio").closest(".item-selector-row");
    await user.click(row!);
  });
});
