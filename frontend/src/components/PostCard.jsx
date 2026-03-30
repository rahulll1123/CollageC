/** @format */

import { useState } from "react";

export const PostCard = ({ post }) => {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<div className="flex flex-col gap-3 bg-secondary border border-border rounded-lg p-4 shadow-lg">
			{/* User and Post Info Section */}
			<div className="flex items-center gap-3">
				<img
					src={post.user.profile.avatar || "./default-avatar.svg"}
					alt={post.user.name}
					className="h-8 w-8 rounded-full object-cover"
				/>
				<h2 className="text-lg font-bold text-zinc-100 truncate">
					{post.title}
				</h2>
			</div>

			{/* Image Scroller */}
			{post.images && post.images.length > 0 ? (
				<div className="flex gap-2 overflow-x-auto snap-x snap-mandatory no-scrollbar rounded-sm">
					{post.images.map((image, index) => (
						<div
							key={index}
							className="shrink-0 w-full snap-center aspect-square bg-zinc-900"
						>
							<img
								// src={image}
								src="./default-avatar.svg"
								alt={`Post content ${index}`}
								className="h-full w-full object-contain"
							/>
						</div>
					))}
				</div>
			) : (
				<div className="w-full aspect-square bg-zinc-900 flex items-center justify-center text-zinc-500 rounded-sm">
					No images available
				</div>
			)}

			{/* Description Section */}
			<div
				className="cursor-pointer"
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<p
					className={`text-zinc-300 text-sm leading-relaxed ${!isExpanded && "line-clamp-2"}`}
				>
					{post.description}
				</p>
			</div>

			{/* Tags Section */}
			{post.tags && post.tags.length > 0 && (
				<div className="flex flex-wrap gap-2 mt-2">
					{post.tags.map((tag, index) => (
						<span
							key={index}
							className="inline-block bg-zinc-700 text-zinc-400 text-xs px-2 py-1 rounded-md hover:bg-zinc-600 transition-colors"
						>
							{tag}
						</span>
					))}
				</div>
			)}
		</div>
	);
};
