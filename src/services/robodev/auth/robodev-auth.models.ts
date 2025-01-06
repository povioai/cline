import { z } from "zod"

export const googleUrlResponseSchema = z.object({
	url: z.string(),
})

export type GoogleUrlResponse = z.infer<typeof googleUrlResponseSchema>

export const userRegisterRequestSchema = z.object({
	name: z.string(),
	email: z.string().email(),
})

export type UserRegisterRequest = z.infer<typeof userRegisterRequestSchema>

export const userMeResponseSchema = z.object({
	name: z.string(),
	email: z.string().email(),
})

export type UserMeResponse = z.infer<typeof userMeResponseSchema>
