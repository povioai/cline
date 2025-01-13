import { googleUrlResponseSchema, UserMeResponse, userMeResponseSchema, UserRegisterRequest } from "./robodev-auth.models"
import { robodevRestClient } from "../robodev-rest.client"
import { UserNotPartOfAnyOrganizationError } from "../../../shared/errors"

export class RobodevAuthClient {
	async getLoginUrl(): Promise<string> {
		const data = await robodevRestClient.get({ resSchema: googleUrlResponseSchema }, "extension/auth/google/login")

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

	async registerGoogleUser(token: string, data: UserRegisterRequest): Promise<UserMeResponse> {
		try {
			return await robodevRestClient.post(
				{
					resSchema: userMeResponseSchema,
				},
				"extension/user/register/google",
				data,
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				},
			)
		} catch (error) {
			throw new UserNotPartOfAnyOrganizationError()
		}
	}
}
