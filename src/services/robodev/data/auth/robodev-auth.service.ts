import vscode from "vscode"
import { RobodevAuthClient } from "./robodev-auth.client"
import { IAuthorizationFlowCallbackQuery } from "../../interfaces/authorization-flow-callback.query.interface"
import { robodevRestClient } from "../../robodev-rest.client"
import { AuthorizationHeaderInterceptor } from "../../../../utils/rest/interceptors/authorization-header.interceptor"
import { TokenExpiredInterceptor } from "../../../../utils/rest/interceptors/token-expired.interceptor"
import { ContextStorageService } from "../../../context-storage/context-storage.service"
import { IUser } from "../../interfaces/user.interface"
import { WebviewMessageService } from "../../../../core/webview/webview-message.service"

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
		await this.contextStorageService.storeSecret("accessToken", data.accessToken)
		await this.contextStorageService.storeSecret("refreshToken", data.refreshToken)
		await this.contextStorageService.updateGlobalState("user", user)

		await this.addAuthorizationHeaderInterceptor()
		await this.addTokenExpiredInterceptor()
	}

	async addAuthorizationHeaderInterceptor() {
		robodevRestClient.attachInterceptor(AuthorizationHeaderInterceptor, async () => {
			const accessToken = await this.contextStorageService.getSecret("accessToken")

			return accessToken ? `Bearer ${accessToken}` : null
		})
	}

	async addTokenExpiredInterceptor() {
		robodevRestClient.attachInterceptor(TokenExpiredInterceptor, async () => {
			try {
				await this.refreshAccessToken()
			} catch (error) {
				await this.logout()
			}
		})
	}

	async refreshAccessToken() {
		const refreshToken = (await this.contextStorageService.getSecret("refreshToken")) as string

		if (!refreshToken) {
			throw new Error("No refresh token found")
		}

		const data = await this.robodevLoginClient.refreshAccessToken(refreshToken)

		await this.contextStorageService.storeSecret("accessToken", data.accessToken)

		if (data.refreshToken) {
			await this.contextStorageService.storeSecret("refreshToken", data.refreshToken)
		}
	}

	async logout() {
		await this.contextStorageService.updateGlobalState("isSignedIn", false)
		await this.contextStorageService.storeSecret("accessToken", undefined)
		await this.contextStorageService.storeSecret("refreshToken", undefined)
		await this.contextStorageService.updateGlobalState("idToken", undefined)
		await this.contextStorageService.updateGlobalState("user", undefined)
		await this.contextStorageService.updateGlobalState("userErrors", undefined)

		await this.webviewMessageService?.postMessageToWebview({ type: "action", action: "logout" })
	}
}
