import { defineCollection, z } from "astro:content";
import { getWork } from "@bobaboard/ao3.js";
import { readFileSync } from "node:fs";
import { parse } from "yaml";

const removeUndefined = <T>(response: T): response is NonNullable<T> =>
  !!response;

const WorkSummarySchema = z.object({
  id: z.string(),
  locked: z.literal(false),
  title: z.string(),
  rating: z.enum([
    "Not Rated",
    "General Audiences",
    "Teen And Up Audiences",
    "Mature",
    "Explicit",
  ]),
  authors: z.union([
    z.literal("Anonymous"),
    z
      .object({
        username: z.string(),
        pseud: z.string(),
      })
      .array(),
  ]),
});

const LockedWorkSummarySchema = z.object({
  id: z.string(),
  locked: z.literal(true),
});

const fanfictions = defineCollection({
  loader: async () => {
    const file = readFileSync("./src/content/ao3/works.yaml", {
      encoding: "utf-8",
    });
    const workIds = parse(file) as string[];
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
  schema: z.discriminatedUnion("locked", [
    WorkSummarySchema,
    LockedWorkSummarySchema,
  ]),
});

export const collections = { fanfictions };
