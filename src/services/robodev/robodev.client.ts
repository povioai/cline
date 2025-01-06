import axios from "axios"
import { IUserMeResponse } from "./interfaces/users-me.response.interface"
import * as vscode from "vscode"

export class RobodevClient {
	readonly baseUrl = "http://localhost:3002"

	async getLoginUrl(): Promise<string> {
		const loginData = await axios.get(`${this.baseUrl}/auth/google/login`)

		const url = loginData.data.url

		return url
	}

	async getUsersMe(token: string): Promise<IUserMeResponse | undefined> {
		try {
			const response = await axios.get(`${this.baseUrl}/user/me`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			})

			return response.data
		} catch (e: any) {
			vscode.window.showErrorMessage("Failed to get user data: ", e.message)
			return
		}
	}

	async postTask(token: string, data: ITaskRequest) {
		await axios.post(`${this.baseUrl}/usage-logs-me/usage-logs`, data, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})
	}

	async getOrganizationKeys(token: string): Promise<string> {
		const response = await axios.get(`${this.baseUrl}/organizations`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		return response.data.key
	}

	async registerGoogleUser(token: string, data: IUserMeResponse): Promise<void> {
		await axios.post(
			`${this.baseUrl}/user/register/google`,
			{
				email: data.email,
				name: data.name,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			},
		)
	}
}
