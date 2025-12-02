import type { BuildTreeResult } from "../ItemSelector/tree.ts";

export const tree: BuildTreeResult = {
  roots: [
    {
      folder: {
        id: 1,
        title: "Audio",
        parentId: null,
      },
      childrenFolders: [
        {
          folder: {
            id: 4,
            title: "Speakers",
            parentId: 1,
          },
          childrenFolders: [
            {
              folder: {
                id: 10,
                title: "Active speakers",
                parentId: 4,
              },
              childrenFolders: [],
              items: [
                {
                  id: 1,
                  title: "Active Speakers Item 1",
                  folderId: 10,
                },
              ],
              allDescendantItems: [
                {
                  id: 1,
                  title: "Active Speakers Item 1",
                  folderId: 10,
                },
              ],
            },
            {
              folder: {
                id: 2,
                title: "Passive speakers",
                parentId: 4,
              },
              childrenFolders: [],
              items: [
                {
                  id: 3,
                  title: "Passive Speakers Item 1",
                  folderId: 2,
                },
              ],
              allDescendantItems: [
                {
                  id: 3,
                  title: "Passive Speakers Item 1",
                  folderId: 2,
                },
              ],
            },
          ],
          items: [
            {
              id: 7,
              title: "Speaker item 1",
              folderId: 4,
            },
            {
              id: 4,
              title: "Speaker item 2",
              folderId: 4,
            },
          ],
          allDescendantItems: [
            {
              id: 7,
              title: "Speaker item 1",
              folderId: 4,
            },
            {
              id: 4,
              title: "Speaker item 2",
              folderId: 4,
            },
            {
              id: 1,
              title: "Active Speakers Item 1",
              folderId: 10,
            },
            {
              id: 3,
              title: "Passive Speakers Item 1",
              folderId: 2,
            },
          ],
        },
      ],
      items: [
        {
          id: 5,
          title: "Audio item 1",
          folderId: 1,
        },
      ],
      allDescendantItems: [
        {
          id: 5,
          title: "Audio item 1",
          folderId: 1,
        },
        {
          id: 7,
          title: "Speaker item 1",
          folderId: 4,
        },
        {
          id: 4,
          title: "Speaker item 2",
          folderId: 4,
        },
        {
          id: 1,
          title: "Active Speakers Item 1",
          folderId: 10,
        },
        {
          id: 3,
          title: "Passive Speakers Item 1",
          folderId: 2,
        },
      ],
    },
    {
      folder: {
        id: 8,
        title: "Rigging",
        parentId: null,
      },
      childrenFolders: [
        {
          folder: {
            id: 6,
            title: "Truss",
            parentId: 8,
          },
          childrenFolders: [],
          items: [
            {
              id: 6,
              title: "Truss item 1",
              folderId: 6,
            },
            {
              id: 8,
              title: "Truss item 2",
              folderId: 6,
            },
          ],
          allDescendantItems: [
            {
              id: 6,
              title: "Truss item 1",
              folderId: 6,
            },
            {
              id: 8,
              title: "Truss item 2",
              folderId: 6,
            },
          ],
        },
      ],
      items: [],
      allDescendantItems: [
        {
          id: 6,
          title: "Truss item 1",
          folderId: 6,
        },
        {
          id: 8,
          title: "Truss item 2",
          folderId: 6,
        },
      ],
    },
  ],
  byId: new Map([]),
};
