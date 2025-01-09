import vscode from "vscode"
import { RobodevAuthClient } from "./robodev-auth.client"
import { IAuthorizationFlowCallbackQuery } from "../interfaces/authorization-flow-callback.query.interface"
import { robodevRestClient } from "../robodev-rest.client"
import { AuthorizationHeaderInterceptor } from "../../../utils/rest/interceptors/authorization-header.interceptor"
import { TokenExpiredInterceptor } from "../../../utils/rest/interceptors/token-expired.interceptor"
import { ContextStorageService } from "../../context-storage/context-storage.service"
import { IUser } from "../interfaces/user.interface"

export class RobodevAuthService {
	private readonly contextStorageService: ContextStorageService
	private readonly robodevLoginClient: RobodevAuthClient

	constructor(context: vscode.ExtensionContext) {
		this.robodevLoginClient = new RobodevAuthClient()
		this.contextStorageService = new ContextStorageService(context)
	}

	async openGoogleAuthFlow() {
		const url = await this.robodevLoginClient.getLoginUrl()
		vscode.env.openExternal(vscode.Uri.parse(url))
	}

	async handleAuthorizationFlowCallback(data: IAuthorizationFlowCallbackQuery) {
		let user: IUser | undefined

		try {
			user = await this.robodevLoginClient.getUsersMe(data.accessToken)
		} catch (error) {
			if (data.email && data.name) {
				user = await this.robodevLoginClient.registerGoogleUser(data.accessToken, {
					email: data.email,
					name: data.name,
				})
			}
		}

		if (!user) {
			return
		}

		await this.contextStorageService.updateGlobalState("isSignedIn", true)
		await this.contextStorageService.updateGlobalState("accessToken", data.accessToken)
		await this.contextStorageService.updateGlobalState("refreshToken", data.refreshToken)
		await this.contextStorageService.updateGlobalState("user", user)

		robodevRestClient.attachInterceptor(AuthorizationHeaderInterceptor, async () => {
			const accessToken = await this.contextStorageService.getGlobalState("accessToken")

			return accessToken ? `Bearer ${accessToken}` : null
		})

		robodevRestClient.attachInterceptor(TokenExpiredInterceptor, async () => {
			await this.logout()
		})
	}

	async logout() {
		await this.contextStorageService.updateGlobalState("isSignedIn", false)
		await this.contextStorageService.updateGlobalState("accessToken", undefined)
		await this.contextStorageService.updateGlobalState("refreshToken", undefined)
		await this.contextStorageService.updateGlobalState("idToken", undefined)
		await this.contextStorageService.updateGlobalState("user", undefined)
		await this.contextStorageService.updateGlobalState("userErrors", undefined)
	}
}
