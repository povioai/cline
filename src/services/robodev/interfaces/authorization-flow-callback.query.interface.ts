export interface IAuthorizationFlowCallbackQuery {
	accessToken: string
	refreshToken?: string
	idToken?: string
	email?: string
	name?: string
}
