import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders, userEvent } from "../../test-utils.tsx";
import { ItemRow } from "../components/ItemRow.tsx";

describe("ItemRow", () => {
  it("should render and match snapshot", () => {
    const { asFragment } = renderWithProviders(
      <ItemRow depth={1} id={1} title="Sample Item" />,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("should render with correct padding based on depth", () => {
    renderWithProviders(<ItemRow depth={2} id={1} title="Test Item" />);
    const row = screen.getByText("Test Item").closest(".item-selector-row");
    expect(row).toHaveStyle({ paddingLeft: "32px" });
  });

  it("should toggle item selection when clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ItemRow depth={1} id={1} title="Test Item" />);

    const checkbox = screen.getByTestId("item-selector-checkbox-1");
    expect(checkbox).not.toBeChecked();

    const row = screen.getByText("Test Item").closest(".item-selector-row");
    await user.click(row!);

    expect(checkbox).toBeChecked();
  });

  it("should deselect item when clicked again", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ItemRow depth={1} id={1} title="Test Item" />);

    const checkbox = screen.getByTestId("item-selector-checkbox-1");
    const row = screen.getByText("Test Item").closest(".item-selector-row");

    await user.click(row!);
    expect(checkbox).toBeChecked();

    await user.click(row!);
    expect(checkbox).not.toBeChecked();
  });

  it("should display the item title", () => {
    renderWithProviders(<ItemRow depth={0} id={5} title="My Item Title" />);
    expect(screen.getByText("My Item Title")).toBeInTheDocument();
  });
});
