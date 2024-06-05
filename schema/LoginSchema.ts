import { z } from "zod";

const loginSchema = z.object({
  identifier: z.string().email(),
  password: z.string().min(8).max(100),
});

export default loginSchema;
