import * as z from "zod";

export const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Video Prompt must be at least 1 character long",
  }),
});
