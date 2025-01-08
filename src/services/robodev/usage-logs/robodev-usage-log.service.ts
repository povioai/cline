import { RobodevUsageLogClient } from "./robodev-usage-log.client"
import { UsageLogRequest } from "./robodev-usage-log.models"

export class RobodevUsageLogService {
	private readonly robodevUsageLogClient: RobodevUsageLogClient

	constructor() {
		this.robodevUsageLogClient = new RobodevUsageLogClient()
	}

	async createUsageLog(data: UsageLogRequest) {
		await this.robodevUsageLogClient.createUsageLog(data)
	}
}
