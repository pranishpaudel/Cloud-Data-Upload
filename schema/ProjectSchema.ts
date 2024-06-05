import { z } from "zod";

const projectSchema = z.object({
  name: z.string().min(1).max(50),
  description: z.string().min(8).max(100),
  folder: z.string().min(1).max(50),
});

export default projectSchema;
