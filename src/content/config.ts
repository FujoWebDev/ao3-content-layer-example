import { defineCollection } from "astro:content";
import { getWork } from "@bobaboard/ao3.js";
import { readFileSync } from "node:fs";
import { parse } from "yaml";

const removeUndefined = <T>(response: T): response is NonNullable<T> =>
  !!response;

const fanfictions = defineCollection({
  loader: async () => {
    const file = readFileSync("./src/content/ao3/works.yaml", {
      encoding: "utf-8",
    });
    const workIds = parse(file) as string[];
    console.log(workIds);
    const responses = await Promise.allSettled(
      workIds.map((workId) => getWork({ workId: workId.toString() }))
    );
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
