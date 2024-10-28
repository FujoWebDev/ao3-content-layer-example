import { defineCollection } from "astro:content";
import { getWork } from "@bobaboard/ao3.js";

const removeUndefined = <T>(response: T): response is NonNullable<T> =>
  !!response;

const fanfictions = defineCollection({
  loader: async () => {
    const responses = await Promise.allSettled([
      getWork({ workId: "38226814" }),
      getWork({ workId: "49238326" }),
      getWork({ workId: "59988091" }),
      getWork({ workId: "41160522" }),
    ]);
    // Must return an array of entries with an id property,
    // or an object with IDs as keys and entries as values
    return responses
      .map((response) => {
        if (response.status == "rejected") {
          return;
        }
        return response.value;
      })
      .filter(removeUndefined);
  },
  // optionally add a schema
  // schema: z.object...
});

export const collections = { fanfictions };
