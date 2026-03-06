import { defineCollection, z } from "astro:content";

const ventures = defineCollection({
  type: "data",
  schema: z.object({
    name: z.string(),
    descriptor: z.string(),
    status: z.enum(["active", "coming-soon"]),
    url: z.string().optional(),
    urlLabel: z.string().optional(),
    internal: z.boolean().default(false),
  }),
});

export const collections = { ventures };
