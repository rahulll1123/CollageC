/** @format */

import { keepLogs } from "../utils/keepLogs.js";

export default function LogRequest(req, res, next) {
	keepLogs(`${req.method} ${req.url}`);
	next();
}
