import vscode from "vscode"
import path from "path"
import fs from "node:fs"

export function getProjectName(): string {
	let workspaceName = vscode.workspace.name ?? "Unknown Project"

	const workspaceFolders = vscode.workspace.workspaceFolders

	if (!workspaceFolders || workspaceFolders.length === 0) {
		return workspaceName
	}

	const rootPath = workspaceFolders[0].uri.fsPath

	const gitConfigPath = path.join(rootPath, ".git", "config")

	if (!fs.existsSync(gitConfigPath)) {
		return workspaceName
	}

	try {
		const gitConfigContent = fs.readFileSync(gitConfigPath, "utf8")
		const match = gitConfigContent.match(/url = .*\/([^/]+)\.git/)

		return match ? match[1] : workspaceName
	} catch (error) {
		return workspaceName
	}
}
