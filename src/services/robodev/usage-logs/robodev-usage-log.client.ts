import { RestClient } from "../../../utils/rest/rest.client"
import { z } from "zod"
import { UsageLogRequest } from "./robodev-usage-log.models"

export class RobodevUsageLogClient {
	private readonly restClient = new RestClient({ config: { baseURL: "http://localhost:3002" } })

	async createUsageLog(token: string, data: UsageLogRequest) {
		await this.restClient.post({ resSchema: z.any() }, "/usage-logs-me/usage-logs", data, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
	}
}
