import { z } from "zod"
import { UsageLogRequest } from "./robodev-usage-log.models"
import { robodevRestClient } from "../robodev-rest.client"

export class RobodevUsageLogClient {
	async createUsageLog(organizationId: string, data: UsageLogRequest) {
		await robodevRestClient.post({ resSchema: z.any() }, `/organizations/${organizationId}/usage-logs`, data)
	}
}
