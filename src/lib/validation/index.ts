import * as z from "zod"

export const SignUpValidation = z.object({
  name: z.string().min(2, { message: 'Too short. Type at least 2 chars' }),
  username: z.string().min(2, { message: 'Too short. Type at at least 2 chars' }),
  email: z.string().email(),
  password: z.string().min(8, { message: 'Too short. Type at at least 8 chars' }),
})

export const SignInValidation = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: 'Password incorrect' }),
})

export const ProfileValidation = z.object({
  file: z.custom<File[]>(),
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  username: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email(),
  bio: z.string(),
});

export const PostValidation = z.object({
  caption: z.string().min(5).max(2200),
  file: z.custom<File[]>(),
  location: z.string().min(2).max(100),
  tags: z.string(),
})

export const CommentValidation = z.object({
  TextComment: z.string().min(1).max(2200),
})