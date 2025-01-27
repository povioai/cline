/* do not edit this unless you are bootstraping the project and know what you are doing */
import axios from "axios"
import { z } from "zod"
import { extractServerErrorMessage } from "./rest.utils"
import * as vscode from "vscode"

// codes that we want to handle in every scenario
export type GeneralErrorCodes = "DATA_VALIDATION_ERROR" | "NETWORK_ERROR" | "CANCELED_ERROR" | "INTERNAL_ERROR" | "UNKNOWN_ERROR"

export class ApplicationException<CodeT> extends Error {
	public code: CodeT

	public serverMessage: string | null = null

	constructor(message: string, code: CodeT, serverMessage: string | null) {
		super(message)

		this.code = code
		this.serverMessage = serverMessage
	}
}

interface ErrorEntry<CodeT> {
	code: CodeT
	condition: (error: unknown) => boolean
	getMessage: (error: unknown) => string
}

export class ErrorHandler<CodeT extends string> {
	entries: ErrorEntry<CodeT | GeneralErrorCodes>[] = []

	constructor(entries: ErrorEntry<CodeT>[]) {
		type ICodeT = CodeT | GeneralErrorCodes

		// implement checking for each of the general errors

		const dataValidationError: ErrorEntry<ICodeT> = {
			code: "DATA_VALIDATION_ERROR",
			condition: (e) => {
				return e instanceof z.ZodError
			},
			getMessage: () => "Data validation error",
		}

		const internalError: ErrorEntry<ICodeT> = {
			code: "INTERNAL_ERROR",
			condition: (e) => {
				if (axios.isAxiosError(e)) {
					return e.response?.status != null && e.response.status >= 500 && e.response.status < 600
				}

				return false
			},
			getMessage: () => "Internal server error",
		}

		const networkError: ErrorEntry<ICodeT> = {
			code: "NETWORK_ERROR",
			condition: (e) => {
				if (axios.isAxiosError(e)) {
					return e.code === "ERR_NETWORK"
				}

				return false
			},
			getMessage: () => "Network error",
		}

		const canceledError: ErrorEntry<ICodeT> = {
			code: "CANCELED_ERROR",
			condition: (e) => {
				if (axios.isCancel(e)) {
					return true
				}

				if (axios.isAxiosError(e) && e.code === "ECONNABORTED") {
					return true
				}

				return false
			},
			getMessage: () => "Request was canceled",
		}

		const unknownError: ErrorEntry<ICodeT> = {
			code: "UNKNOWN_ERROR",
			condition: () => true,
			getMessage: () => "Internal server error",
		}

		// general errors have the lowest priority
		this.entries = [...entries, dataValidationError, internalError, networkError, canceledError, unknownError]
	}

	// convert the error into an application exception
	public rethrowError(error: unknown): ApplicationException<CodeT | GeneralErrorCodes> {
		const errorEntry = this.entries.find((entry) => entry.condition(error ?? {}))!

		const serverMessage = extractServerErrorMessage(error)
		throw new ApplicationException(errorEntry.getMessage(error), errorEntry.code, serverMessage)
	}

	// eslint-disable-next-line class-methods-use-this
	public getError(error: unknown): ApplicationException<CodeT | GeneralErrorCodes> | null {
		if (error instanceof ApplicationException) {
			return error
		}

		return null
	}

	// eslint-disable-next-line class-methods-use-this
	public getErrorCode(error: unknown): CodeT | GeneralErrorCodes | null {
		if (error instanceof ApplicationException) {
			return error.code
		}

		return null
	}

	public static getErrorMessage(error: unknown, fallbackToUnknown: boolean = true): string | null {
		if (typeof error === "string") {
			return error
		}

		if (error instanceof Error) {
			return error.message
		}

		if (error instanceof ApplicationException) {
			return error.message
		}

		if (fallbackToUnknown) {
			return "An unknown error occurred"
		}

		return null
	}
}

// can be used for endpoints that only need general error handling
export const SharedErrorHandler = new ErrorHandler<never>([])
