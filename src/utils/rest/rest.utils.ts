import axios from "axios"
import { z } from "zod"

export const extractServerErrorMessage = (e: unknown): string | null => {
	if (e instanceof z.ZodError) {
		return e.message
	}

	if (!axios.isAxiosError(e)) {
		return null
	}

	if (!e.response) {
		return null
	}

	const data = e.response.data as { message: unknown } | undefined

	if (typeof data?.message === "string") {
		return data.message
	}

	return null
}
