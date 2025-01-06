import * as vscode from "vscode"
import { RestClient } from "../../../utils/rest/rest.client"
import {
	googleUrlResponseSchema,
	UserMeResponse,
	userMeResponseSchema,
	UserRegisterRequest,
} from "./robodev-login.models"

export class RobodevLoginClient {
	private readonly restClient = new RestClient({ config: { baseURL: "http://localhost:3002" } })

	async getLoginUrl(): Promise<string> {
		const data = await this.restClient.get({ resSchema: googleUrlResponseSchema }, "/auth/google/login")

		return data.url
	}

	async getUsersMe(token: string): Promise<UserMeResponse | undefined> {
		try {
			const data = await this.restClient.get(
				{
					resSchema: userMeResponseSchema,
				},
				"/user/me",
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)

			return data
		} catch (e: any) {
			vscode.window.showErrorMessage("Failed to get user: ")
			return
		}
	}

	async registerGoogleUser(token: string, data: UserRegisterRequest): Promise<void> {
		await this.restClient.post(
			{
				resSchema: userMeResponseSchema,
			},
			"/user/register/google",
			data,
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		)
	}
}
