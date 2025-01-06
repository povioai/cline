import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, CreateAxiosDefaults } from "axios"
import { z } from "zod"

import { RestInterceptor } from "./rest-interceptor"
import { ErrorHandler, GeneralErrorCodes, SharedErrorHandler } from "./error-handling"
import * as vscode from "vscode"

interface RequestInfo<ZResDto extends z.ZodRawShape, ResDto, Res, ECodes extends string> {
	resSchema: z.ZodEffects<z.ZodObject<ZResDto, "strip", z.ZodTypeAny, ResDto>, Res> | z.ZodSchema<Res>
	errorHandler?: ErrorHandler<ECodes>
}

type Method = "get" | "post" | "put" | "delete"

const MethodHasBody: Record<Method, boolean> = {
	get: false,
	post: true,
	put: true,
	delete: false,
}

export class RestClient {
	private client: AxiosInstance

	constructor({
		config,
		interceptors,
	}: {
		config?: CreateAxiosDefaults
		interceptors?: RestInterceptor<any[]>[]
	} = {}) {
		this.client = axios.create(config)

		this.attachInterceptors(interceptors)
	}

	public attachInterceptors<T extends any[]>(interceptors?: RestInterceptor<T>[], ...args: T) {
		if (interceptors != null) {
			interceptors.forEach((interceptor) => this.attachInterceptor(interceptor, ...args))
		}
	}

	public attachInterceptor<T extends any[]>(interceptor: RestInterceptor<T>, ...args: T) {
		interceptor.addInterceptor(this.client, ...args)
	}

	public ejectInterceptor<T extends any[]>(interceptor: RestInterceptor<T>) {
		interceptor.removeInterceptor(this.client)
	}

	public async get<ZResDto extends z.ZodRawShape, ResDto, Res, ECodes extends string = GeneralErrorCodes>(
		requestInfo: RequestInfo<ZResDto, ResDto, Res, ECodes>,
		url: string,
		config?: AxiosRequestConfig,
	): Promise<Res> {
		return this.makeRequest(requestInfo, "get", url, undefined, config)
	}

	public async post<ZResDto extends z.ZodRawShape, ResDto, Res, ECodes extends string = GeneralErrorCodes>(
		requestInfo: RequestInfo<ZResDto, ResDto, Res, ECodes>,
		url: string,
		data?: any,
		config?: AxiosRequestConfig,
	): Promise<Res> {
		return this.makeRequest(requestInfo, "post", url, data, config)
	}

	public async put<ZResDto extends z.ZodRawShape, ResDto, Res, ECodes extends string = GeneralErrorCodes>(
		requestInfo: RequestInfo<ZResDto, ResDto, Res, ECodes>,
		url: string,
		data?: any,
		config?: AxiosRequestConfig,
	): Promise<Res> {
		return this.makeRequest(requestInfo, "put", url, data, config)
	}

	public async delete<ZResDto extends z.ZodRawShape, ResDto, Res, ECodes extends string = GeneralErrorCodes>(
		requestInfo: RequestInfo<ZResDto, ResDto, Res, ECodes>,
		url: string,
		config?: AxiosRequestConfig,
	): Promise<Res> {
		return this.makeRequest(requestInfo, "delete", url, undefined, config)
	}

	private async makeRequest<ZResDto extends z.ZodRawShape, ResDto, Res, ECodes extends string = GeneralErrorCodes>(
		requestInfo: RequestInfo<ZResDto, ResDto, Res, ECodes>,
		method: Method,
		url: string,
		data?: any,
		config?: AxiosRequestConfig,
	): Promise<Res> {
		try {
			let res: AxiosResponse
			if (MethodHasBody[method]) {
				res = await this.client[method](url, data, config)
			} else {
				res = await this.client[method](url, config)
			}

			return requestInfo.resSchema.parse(res.data) as Res
		} catch (e) {
			const errorHandler = requestInfo.errorHandler ?? SharedErrorHandler
			errorHandler.rethrowError(e)
			throw e
		}
	}
}
