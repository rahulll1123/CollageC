/** @format */

import jwt from "jsonwebtoken";
async function authMiddleware(req, res, next) {
	const token = req.cookies.token;
	if (!token) {
		return res.status(401).json({ message: "Unauthorized" });
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		console.log(decoded);

		next();
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			return res.status(401).json({ message: "Token expired" });
		}
		console.error("Authentication Error:", error);
		res.status(401).json({ message: "Invalid token" });
	}
}

export default authMiddleware;
