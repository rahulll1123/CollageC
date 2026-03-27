/** @format */

async function UploadImage(req, res, next) {
	req.images = [];
	next();
}

export { UploadImage };
