import { z } from "zod"

export const internalAuthLoginSchema = z.object({
  password: z.string().trim().min(1, "password is required"),
  username: z.string().trim().min(1, "username is required"),
})

export type InternalAuthLoginInput = z.infer<typeof internalAuthLoginSchema>
