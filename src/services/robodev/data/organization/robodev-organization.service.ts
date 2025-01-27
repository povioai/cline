import { RobodevOrganizationClient } from "./robodev-organization.client"
import { UserNotPartOfAnyOrganizationError } from "../../../../shared/errors"
import { ContextStorageService } from "../../../context-storage/context-storage.service"
import vscode from "vscode"
import { LlmApiProvider } from "../../../../shared/ExtensionMessage"

export class RobodevOrganizationService {
	private readonly contextStorageService: ContextStorageService
	private readonly robodevOrganizationClient: RobodevOrganizationClient

	constructor(context: vscode.ExtensionContext) {
		this.contextStorageService = new ContextStorageService(context)
		this.robodevOrganizationClient = new RobodevOrganizationClient()
	}

	async storeOrganizationKeys() {
		const paginatedOrganizations = await this.robodevOrganizationClient.getUserOrganizations()

		if (paginatedOrganizations.items.length === 0) {
			throw new UserNotPartOfAnyOrganizationError()
		}

		const firstOrganization = paginatedOrganizations.items[0]

		await this.contextStorageService.updateGlobalState("currentOrganizationId", firstOrganization.id)

		const data = await this.robodevOrganizationClient.getOrganizationKeys(firstOrganization.id)

		const anthropicKey = data?.items?.find((data) => data.provider === "ANTHROPIC")?.key

		const openaiKey = data?.items?.find((data) => data.provider === "OPENAI")?.key

		const deepSeekKey = data?.items?.find((data) => data.provider === "DEEPSEEK")?.key

		await this.contextStorageService.storeSecret("apiKey", anthropicKey)
		await this.contextStorageService.storeSecret("openAiNativeApiKey", openaiKey)
		await this.contextStorageService.storeSecret("deepSeekApiKey", deepSeekKey)

		const availableProviders: LlmApiProvider[] = [
			{
				name: "Anthropic",
				value: "anthropic",
				enabled: !!anthropicKey,
			},
			{
				name: "OpenAI",
				value: "openai-native",
				enabled: !!openaiKey,
			},
			{
				name: "DeepSeek",
				value: "deepseek",
				enabled: !!deepSeekKey,
			},
		]

		await this.contextStorageService.updateGlobalState("apiProviders", availableProviders)

		return availableProviders
	}
}
