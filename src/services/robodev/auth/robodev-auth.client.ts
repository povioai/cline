import {
	googleUrlResponseSchema,
	UserMeResponse,
	userMeResponseSchema,
	UserRegisterRequest,
} from "./robodev-auth.models"
import { robodevRestClient } from "../robodev-rest.client"

export class RobodevAuthClient {
	async getLoginUrl(): Promise<string> {
		const data = await robodevRestClient.get({ resSchema: googleUrlResponseSchema }, "/auth/google/login")

		return data.url
	}

	async getUsersMe(token: string): Promise<UserMeResponse | undefined> {
		const data = await robodevRestClient.get(
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
	}

	registerGoogleUser(token: string, data: UserRegisterRequest): Promise<UserMeResponse> {
		return robodevRestClient.post(
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
