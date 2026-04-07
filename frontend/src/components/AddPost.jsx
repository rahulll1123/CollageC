/** @format */
import { useState } from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { ImagePlus } from "lucide-react";

export function AddPost() {
	//	 	project = null,
	// 		title,
	// 		description,
	// 		images,
	// 		tags = [],
	const [isSubmitting, setIsSubmitting] = useState(false);
	const navigate = useNavigate();

	const PostSchema = z.object({
		title: z.string().min(5, "Min string Length 5"),
		description: z.string(),
		tags: z.string().regex(/^[a-zA-Z,0-9 +]+$/, "comma separated tags"),
		image: z.custom((val) => val instanceof FileList).optional(),
	});

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver: zodResolver(PostSchema) });

	const onSubmit = async (data) => {
		console.log(data);
		setIsSubmitting(true);
		const formData = new FormData();
		formData.append("title", data.title);
		formData.append("description", data.description);
		formData.append("tags", data.tags);

		if (data.image && data.image[0]) {
			formData.append("image", data.image[0]);
		}
		try {
			const res = await axios.post("/api/post/", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			console.log("Form Data:", formData);
			toast.success("Post Created");
			console.log("res");
			navigate("/");
		} catch (error) {
			console.log(errors);
		}
		setIsSubmitting(false);
	};

	return (
		<>
			<div className="w-full h-dvh flex justify-center items-center">
				<Card className="w-full h-fit flex-col max-w-sm">
					<form
						onSubmit={handleSubmit(onSubmit)}
						encType="multipart/form-data">
						<div className="grid gap-2 p-4">
							<Label htmlFor="title">Title</Label>
							<Input
								type="text"
								name="title"
								id="title"
								{...register("title")}
								className={
									errors.title ? "border-destructive" : ""
								}
							/>
							{errors.title && (
								<p className="text-sm font-medium text-destructive">
									{errors.title.message}
								</p>
							)}

							<Label htmlFor="image">Image</Label>
							<Input
								type="file"
								id="image"
								accept="image/*"
								{...register("image")}
								className={`cursor-pointer ${errors.image ? "border-destructive" : ""}`}
							/>
							{/* <ImagePlus /> */}
							<Label htmlFor="description">Description</Label>
							<Textarea
								type="text"
								name="description"
								id="description"
								{...register("description")}
								className="no-scrollbar"
							/>
							{errors.description && (
								<p>{errors.description.message}</p>
							)}

							<Label htmlFor="tags">Tags</Label>
							<Input
								type="text"
								name="tags"
								id="tags"
								{...register("tags")}
							/>
							{errors.tags && <p>{errors.tags.message}</p>}

							<Button
								type="submit"
								disabled={isSubmitting}
								className="disabled:text-muted-foreground">
								Submit
							</Button>
						</div>
					</form>
				</Card>
			</div>
		</>
	);
}
