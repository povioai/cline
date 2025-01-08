import { RobodevOrganizationClient } from "./robodev-organization.client"
import { RobodevOrganizationKeys } from "./robodev-organization.types"

export class RobodevOrganizationService {
	private readonly robodevOrganizationClient: RobodevOrganizationClient

	constructor() {
		this.robodevOrganizationClient = new RobodevOrganizationClient()
	}

	async getOrganizationKeys(): Promise<RobodevOrganizationKeys> {
		const paginatedOrganizations = await this.robodevOrganizationClient.getUserOrganizations()

		const firstOrganization = paginatedOrganizations.items[0]

		if (!firstOrganization) {
			return {}
		}

		const organization = await this.robodevOrganizationClient.getOrganizationById(firstOrganization.id)

		const anthropicKey = organization?.keys?.find((data) => data.provider === "ANTHROPIC")?.key

		const openaiKey = organization?.keys?.find((data) => data.provider === "OPENAI")?.key

		return {
			anthropicKey,
			openaiKey,
		}
	}
}
