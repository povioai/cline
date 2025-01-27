import fs from "node:fs"

export const ensureFolderExists = async (folderPath: string): Promise<void> => {
	try {
		fs.access(folderPath, (err) => {})
	} catch (error) {
		if (error.code === "ENOENT") {
			fs.mkdir(folderPath, { recursive: true }, (err) => {})
		}
	}
}
