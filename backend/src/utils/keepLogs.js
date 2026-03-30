/** @format */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function keepLogs(log) {
	const logsDir = path.join(__dirname, "../logs");
	if (!fs.existsSync(logsDir)) {
		fs.mkdirSync(logsDir, { recursive: true });
	}
	const logFile = path.join(logsDir, "app.log");

	fs.appendFileSync(logFile, `${new Date().toISOString()} - ${log}\n`);
	if (process.env.NODE_ENV === "development") {
		console.log(log);
	}
}
