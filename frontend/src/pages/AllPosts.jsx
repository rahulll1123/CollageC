/** @format */
import React from "react";
import { useEffect, useState } from "react";
import { PostCard } from "@/components/PostCard";

import axios from "axios";
import { CommentsCard } from "@/components/CommentsCard";

export default function AllPosts() {
	const [page, setPage] = useState(1);
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [commentIdPost, setCommentIdPost] = useState(null);

	useEffect(() => {
		const fetchPosts = async () => {
			setLoading(true);
			try {
				const response = await axios.get(
					`/api/post?page=${page}&limit=10`,
				);
				console.log(response.data);
				setPosts(response.data);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		};

		fetchPosts();
	}, [page]);

	return (
		<div>
			<div className="flex justify-center items-center flex-col gap-1 w-full bg-zinc-950 min-h-screen py-8">
				{loading && (
					<p className="text-zinc-400 animate-pulse">
						Loading posts...
					</p>
				)}
				{error && (
					<p className="text-red-400 bg-red-900/20 p-4 rounded-lg">
						Error: {error}
					</p>
				)}

				{!loading && !error && (
					<div className="flex flex-col gap-2 w-[70%] md:w-[90%] max-w-md">
						{posts.map((post) => (
							<PostCard
								key={post._id}
								post={post}
								setCommentIdPost={setCommentIdPost}
							/>
						))}
					</div>
				)}
			</div>
			{commentIdPost && (
				<CommentsCard
					postId={commentIdPost}
					setCommentIdPost={setCommentIdPost}
				/>
			)}
			<button
				onClick={() => setPage((prev) => prev + 1)}
				className="fixed bottom-4 right-4 bg-primary text-white px-4 py-2 rounded-full shadow-lg hover:bg-primary/80 transition-colors">
				Next
			</button>
			<button
				onClick={() => {
					if (page >= 1) {
						setPage((prev) => prev - 1);
					}
				}}
				className="fixed bottom-4 left-4 bg-primary text-white px-4 py-2 rounded-full shadow-lg hover:bg-primary/80 transition-colors">
				Previous
			</button>
		</div>
	);
}
