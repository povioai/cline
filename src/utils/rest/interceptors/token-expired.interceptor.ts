import { AxiosError } from "axios"

import { RestInterceptor } from "./rest-interceptor"

export const TokenExpiredInterceptor = new RestInterceptor((client, onExpired: () => Promise<void>) => {
	return client.interceptors.response.use(
		(response) => {
			return response
		},
		async (error) => {
			if (!(error instanceof AxiosError)) {
				return Promise.reject(error)
			}

			const { config } = error

			const hasFailedDueToAccessTokenExpiry = error.response?.status === 401
			const hasFailedDueToForbidden = error.response?.status === 403

			if ((config && hasFailedDueToAccessTokenExpiry) || hasFailedDueToForbidden) {
				await onExpired()
			}

			return Promise.reject(error)
		},
	)
})
