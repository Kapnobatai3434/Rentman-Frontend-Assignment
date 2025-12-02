import { useMemo } from "react";
import { ItemSelectorProvider } from "./context";
import { useItemSelectorQuery } from "./hooks/useItemSelectorQuery.ts";
import { buildFolderTree } from "./tree.ts";
import { TreeNode } from "./components/TreeNode.tsx";
import { Footer } from "./components/Footer.tsx";
import "./styles.css";

export function ItemSelector() {
  const { data, isLoading, isError, error } = useItemSelectorQuery();

  const tree = useMemo(() => {
    if (!data) return null;
    return buildFolderTree(data);
  }, [data]);

  if (isLoading || !tree) {
    return <div>Loading items…</div>;
  }

  if (isError) {
    return <div>Error loading items: {error?.message}</div>;
  }

  return (
    <ItemSelectorProvider tree={tree}>
      <div className="item-selector-page">
        <div className="item-selector-card">
          <TreeNode />
        </div>
        <Footer />
      </div>
    </ItemSelectorProvider>
  );
}
