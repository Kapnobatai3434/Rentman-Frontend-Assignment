import type {
  ItemSelectorResponseRaw,
  ItemSelectorData,
  FolderRecord,
  ItemRecord,
} from "../ItemSelector/types";

function mapFolderRow([id, title, parentId]: [
  number,
  string,
  number | null,
]): FolderRecord {
  return { id, title, parentId };
}

function mapItemRow([id, title, folderId]: [
  number,
  string,
  number,
]): ItemRecord {
  return { id, title, folderId };
}

function randomDelay(min = 400, max = 1500) {
  const delay = Math.floor(Math.random() * (max - min + 1) + min);

  return new Promise((resolve) => setTimeout(resolve, delay));
}

async function fetchItemSelectorData(): Promise<ItemSelectorData> {
  const response = await fetch("/response.json");
  await randomDelay();

  if (!response.ok) {
    throw new Error("Failed to load item selector data");
  }

  const raw = (await response.json()) as ItemSelectorResponseRaw;

  const folders = raw.folders.data.map(mapFolderRow);
  const items = raw.items.data.map(mapItemRow);

  return { folders, items };
}

export { fetchItemSelectorData };
