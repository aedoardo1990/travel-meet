import * as z from "zod"

export const SignUpValidation = z.object({
  name: z.string().min(2, { message: 'Too short. Type at least 2 chars' }),
  username: z.string().min(2, { message: 'Too short. Type at at least 2 chars' }),
  email: z.string().email(),
  password: z.string().min(8, { message: 'Too short. Type at at least 8 chars' }),
})

export const SignInValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: 'Too short. Type at at least 8 chars' }),
})