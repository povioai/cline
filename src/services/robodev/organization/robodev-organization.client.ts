import {
	organizationResponseSchema,
	paginatedOrganizationResponseSchema,
	paginateOrganizationKeysResponseSchema,
} from "./robodev-organization.models"
import { robodevRestClient } from "../robodev-rest.client"

export class RobodevOrganizationClient {
	async getUserOrganizations() {
		return robodevRestClient.get({ resSchema: paginatedOrganizationResponseSchema }, "/organizations")
	}

	async getOrganizationById(organizationId: string) {
		return robodevRestClient.get({ resSchema: organizationResponseSchema }, `/organizations/${organizationId}`)
	}

	async getOrganizationKeys(organizationId: string) {
		return robodevRestClient.get(
			{ resSchema: paginateOrganizationKeysResponseSchema },
			`/organizations/${organizationId}/keys`,
		)
	}
}
