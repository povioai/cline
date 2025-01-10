import { RobodevOrganizationClient } from "./robodev-organization.client"
import { RobodevOrganizationKeys } from "./robodev-organization.types"
import { UserNotPartOfAnyOrganizationError } from "../../../shared/errors"
import { ContextStorageService } from "../../context-storage/context-storage.service"
import vscode from "vscode"

export class RobodevOrganizationService {
	private readonly contextStorageService: ContextStorageService
	private readonly robodevOrganizationClient: RobodevOrganizationClient

	constructor(context: vscode.ExtensionContext) {
		this.contextStorageService = new ContextStorageService(context)
		this.robodevOrganizationClient = new RobodevOrganizationClient()
	}

	async getOrganizationKeys(): Promise<RobodevOrganizationKeys> {
		const paginatedOrganizations = await this.robodevOrganizationClient.getUserOrganizations()

		if (paginatedOrganizations.items.length === 0) {
			throw new UserNotPartOfAnyOrganizationError()
		}

		const firstOrganization = paginatedOrganizations.items[0]

		await this.contextStorageService.updateGlobalState("currentOrganizationId", firstOrganization.id)

		const data = await this.robodevOrganizationClient.getOrganizationKeys(firstOrganization.id)

		const anthropicKey = data?.items?.find((data) => data.provider === "ANTHROPIC")?.key

		const openaiKey = data?.items?.find((data) => data.provider === "OPENAI")?.key

		return {
			anthropicKey,
			openaiKey,
		}
	}
}
