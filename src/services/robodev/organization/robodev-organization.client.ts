import { RestClient } from "../../../utils/rest/rest.client"
import { organizationResponseSchema, paginatedOrganizationResponseSchema } from "./robodev-organization.models"

export class RobodevOrganizationClient {
	private readonly restClient = new RestClient({ config: { baseURL: "http://localhost:3002" } })

	async getUserOrganizations(token: string) {
		return this.restClient.get({ resSchema: paginatedOrganizationResponseSchema }, "/organizations", {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
	}

	async getOrganizationById(token: string, organizationId: string) {
		return this.restClient.get({ resSchema: organizationResponseSchema }, `/organizations/${organizationId}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
	}
}
