import path from "path"
import { cwd, GlobalFileNames } from "../../core/webview/ClineProvider"
import fs from "fs/promises"
import vscode from "vscode"

export async function findRobodevSummaryFileByTaskId(taskId: string) {
	const robodevFolderPath = path.resolve(cwd, GlobalFileNames.robodevSummary)

	const files = await fs.readdir(robodevFolderPath, { withFileTypes: true })

	if (files.length === 0) {
		return undefined
	}

	for (const file of files) {
		const taskIdFromName = file.name.split("-")?.[1]

		vscode.window.showInformationMessage(file.name, taskIdFromName)

		if (taskIdFromName.includes(taskId)) {
			return file
		}
	}

	return undefined
}