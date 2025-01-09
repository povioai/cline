import { RobodevUsageLogClient } from "./robodev-usage-log.client"
import { UsageLogRequest } from "./robodev-usage-log.models"
import { ContextStorageService } from "../../context-storage/context-storage.service"
import vscode from "vscode"

export class RobodevUsageLogService {
	private readonly robodevUsageLogClient: RobodevUsageLogClient
	private readonly contextStorageService: ContextStorageService

	constructor(context: vscode.ExtensionContext) {
		this.contextStorageService = new ContextStorageService(context)
		this.robodevUsageLogClient = new RobodevUsageLogClient()
	}

	async createUsageLog(data: UsageLogRequest) {
		const organizationId = (await this.contextStorageService.getGlobalState("currentOrganizationId")) as string
		await this.robodevUsageLogClient.createUsageLog(organizationId, data)
	}
}
