import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders, userEvent } from "../../test-utils.tsx";
import { Footer } from "../components/Footer.tsx";
import { ItemRow } from "../components/ItemRow.tsx";

describe("Footer", () => {
  it("should render and match snapshot", () => {
    const { asFragment } = renderWithProviders(<Footer />);
    expect(asFragment()).toMatchSnapshot();
  });

  it("should display empty selected IDs when nothing is selected", () => {
    renderWithProviders(<Footer />);
    expect(screen.getByText("Selected item IDs:")).toBeInTheDocument();
  });

  it("should display selected item IDs sorted", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <ItemRow depth={0} id={5} title="Item 5" />
        <ItemRow depth={0} id={2} title="Item 2" />
        <Footer />
      </>,
    );

    await user.click(screen.getByText("Item 5").closest(".item-selector-row")!);
    await user.click(screen.getByText("Item 2").closest(".item-selector-row")!);

    expect(screen.getByText("Selected item IDs: 2, 5")).toBeInTheDocument();
  });

  it("should clear selection when clear button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <>
        <ItemRow depth={0} id={1} title="Item 1" />
        <Footer />
      </>,
    );

    await user.click(screen.getByText("Item 1").closest(".item-selector-row")!);
    expect(screen.getByText("Selected item IDs: 1")).toBeInTheDocument();

    await user.click(screen.getByTestId("clear-selection"));
    expect(screen.getByText("Selected item IDs:")).toBeInTheDocument();
  });

  it("should render clear selection button", () => {
    renderWithProviders(<Footer />);
    expect(screen.getByRole("button", { name: "Clear selection" })).toBeInTheDocument();
  });
});
