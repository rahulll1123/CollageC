/** @format */

import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
	cloud_name: "dexrc6nnw",
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (filePath) => {
	try {
		const result = await cloudinary.uploader.upload(filePath, {
			folder: "collageC",
		});
		console.log("Cloudinary Upload Result:", result);
		return result;
	} catch (error) {
		console.error("Cloudinary Upload Error:", error);
		throw error;
	} finally {
		fs.unlinkSync(filePath);
	}
};

export { uploadToCloudinary };
