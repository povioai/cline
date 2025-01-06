interface ITaskRequest {
	message: string
	images: string[]
	tokens: number
	customInstructions: string
	llmProvider: string
	llmModel: string
}
