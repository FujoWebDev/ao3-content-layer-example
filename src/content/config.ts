import { defineCollection } from "astro:content";
import { getWork } from "@bobaboard/ao3.js";

const fanfictions = defineCollection({
  loader: async () => {
    const response = await getWork({ workId: "38226814" });
    // Must return an array of entries with an id property,
    // or an object with IDs as keys and entries as values
    return [
      {
        id: "38226814",
        ...response,
      },
    ];
  },
  // optionally add a schema
  // schema: z.object...
});

export const collections = { fanfictions };
