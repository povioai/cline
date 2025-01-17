import vscode from "vscode"
import { RobodevAuthClient } from "./robodev-auth.client"
import { IAuthorizationFlowCallbackQuery } from "../interfaces/authorization-flow-callback.query.interface"
import { robodevRestClient } from "../robodev-rest.client"
import { AuthorizationHeaderInterceptor } from "../../../utils/rest/interceptors/authorization-header.interceptor"
import { TokenExpiredInterceptor } from "../../../utils/rest/interceptors/token-expired.interceptor"
import { ContextStorageService } from "../../context-storage/context-storage.service"
import { IUser } from "../interfaces/user.interface"
import { WebviewMessageService } from "../../../core/webview/webview-message.service"

export class RobodevAuthService {
	private readonly contextStorageService: ContextStorageService
	private readonly robodevLoginClient: RobodevAuthClient
	private webviewMessageService?: WebviewMessageService

	constructor(context: vscode.ExtensionContext) {
		this.robodevLoginClient = new RobodevAuthClient()
		this.contextStorageService = new ContextStorageService(context)
	}

	setWebviewMessageService(view: vscode.WebviewView | vscode.WebviewPanel) {
		this.webviewMessageService = new WebviewMessageService(view)
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
			try {
				await this.refreshAccessToken()
			} catch (error) {
				await this.logout()
			}
		})
	}

	async refreshAccessToken() {
		const refreshToken = (await this.contextStorageService.getGlobalState("refreshToken")) as string

		if (!refreshToken) {
			throw new Error("No refresh token found")
		}

		const data = await this.robodevLoginClient.refreshAccessToken(refreshToken)

		await this.contextStorageService.updateGlobalState("accessToken", data.accessToken)

		if (data.refreshToken) {
			await this.contextStorageService.updateGlobalState("refreshToken", data.refreshToken)
		}
	}

	async logout() {
		await this.contextStorageService.updateGlobalState("isSignedIn", false)
		await this.contextStorageService.updateGlobalState("accessToken", undefined)
		await this.contextStorageService.updateGlobalState("refreshToken", undefined)
		await this.contextStorageService.updateGlobalState("idToken", undefined)
		await this.contextStorageService.updateGlobalState("user", undefined)
		await this.contextStorageService.updateGlobalState("userErrors", undefined)
		await this.webviewMessageService?.postMessageToWebview({ type: "action", action: "chatButtonClicked" })
	}
}
