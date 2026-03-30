/** @format */
import React from "react";
import { useEffect, useState } from "react";
import { PostCard } from "@/components/PostCard";

import axios from "axios";

export default function AllPosts() {
	const [page, setPage] = useState(1);
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

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
		<div className="flex justify-center items-center flex-col gap-1 w-full bg-zinc-950 min-h-screen py-8">
			{loading && (
				<p className="text-zinc-400 animate-pulse">Loading posts...</p>
			)}
			{error && (
				<p className="text-red-400 bg-red-900/20 p-4 rounded-lg">
					Error: {error}
				</p>
			)}

			{!loading && !error && (
				<div className="flex flex-col gap-2 w-[70%] md:w-[90%] max-w-md">
					{posts.map((post) => (
						<PostCard key={post._id} post={post} />
					))}
				</div>
			)}
		</div>
	);
}
