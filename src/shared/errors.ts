export interface UserError {
	message: string
	code: string
}

export class UserNotPartOfAnyOrganizationError extends Error {
	static code = "user-not-part-of-an-organization"
}
