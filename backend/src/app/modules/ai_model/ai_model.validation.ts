import { z } from "zod";

const aiModel = z.object({
  body: z.object({
    prompt: z.string({ required_error: "Prompt is required!" }),
    language: z.string().optional(),
  }),
});

const aiStoryContinuation = z.object({
  body: z.object({
    prompt: z
      .string({ required_error: "Prompt is required!" })
      .min(10, "Prompt must be at least 10 characters long.")
      .max(5000, "Prompt must not exceed 5000 characters."),
    language: z.string().optional(),
  }),
});

const aiAlternateEndings = z.object({
  body: z.object({
    title: z.string({ required_error: "Title is required!" }),
    content: z.string({ required_error: "Content is required!" }),
    tag: z.string({ required_error: "Tag is required!" }),
    language: z.string().optional(),
  }),
});



export const AIModelValidator = {
  aiModel,
  aiAlternateEndings,
  aiStoryContinuation,
};

