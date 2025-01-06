import { z } from "zod"

export const usageLogRequestSchema = z.object({
	message: z.string(),
	images: z.array(z.string()),
	tokens: z.number(),
	customInstructions: z.string(),
	llmProvider: z.string(),
	llmModel: z.string(),
})

export type UsageLogRequest = z.infer<typeof usageLogRequestSchema>
