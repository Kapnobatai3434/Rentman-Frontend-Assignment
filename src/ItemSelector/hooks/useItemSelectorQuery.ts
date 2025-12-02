import { useQuery } from "@tanstack/react-query";
import { fetchItemSelectorData } from "../../api/items.ts";
import type { ItemSelectorData } from "../types";

export function useItemSelectorQuery() {
  return useQuery<ItemSelectorData, Error>({
    queryKey: ["item-selector"],
    queryFn: fetchItemSelectorData,
  });
}
