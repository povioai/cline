import { z, ZodType } from "zod"

export const createPaginatedSchema = <T extends ZodType<any>>(itemSchema: T) => {
	return z.object({
		page: z.number().optional(),
		cursor: z.string().optional(),
		nextCursor: z.string().optional(),
		limit: z.number().optional(),
		items: z.array(itemSchema),
		totalItems: z.number(),
	})
}
