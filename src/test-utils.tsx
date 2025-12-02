import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ItemSelectorProvider } from "./ItemSelector/context";
import type { ReactElement } from "react";
import {
  render,
  type RenderOptions,
  type RenderResult,
} from "@testing-library/react";
import { tree } from "./__mocks__/treeMock.ts";

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  const client = new QueryClient();
  return (
    <ItemSelectorProvider tree={tree}>
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    </ItemSelectorProvider>
  );
};

const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "queries">,
): RenderResult => {
  return render(ui, {
    wrapper: AllTheProviders,
    ...options,
  });
};

export { renderWithProviders };
