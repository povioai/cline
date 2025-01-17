import vscode from "vscode"
import { ExtensionMessage } from "../../shared/ExtensionMessage"

export class WebviewMessageService {
	private view: vscode.WebviewView | vscode.WebviewPanel

	constructor(view: vscode.WebviewView | vscode.WebviewPanel) {
		this.view = view
	}

	async postMessageToWebview(message: ExtensionMessage) {
		await this.view.webview.postMessage(message)
	}
}
