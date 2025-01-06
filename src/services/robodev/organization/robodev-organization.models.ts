import { z } from "zod"
import { createPaginatedSchema } from "../shared.models"

export const organizationKeyResponseSchema = z.object({
	id: z.string().uuid(),
	key: z.string(),
	provider: z.string(),
})

export const organizationResponseSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	domain: z.string(),
	keys: z.array(organizationKeyResponseSchema).optional(),
})

export const paginatedOrganizationResponseSchema = createPaginatedSchema(organizationResponseSchema)

export type OrganizationResponseDTO = z.infer<typeof organizationResponseSchema>
export type PaginatedOrganizationResponse = z.infer<typeof paginatedOrganizationResponseSchema>
