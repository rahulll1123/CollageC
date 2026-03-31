/** @format */

import { useEffect, useState, useContext, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2 } from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

export const PostCard = ({ post, setCommentIdPost }) => {
	const { user } = useContext(AuthContext);
	const [isExpanded, setIsExpanded] = useState(false);
	const [like, setLike] = useState(null);
	const [loadinglike, setLoadinglike] = useState(false);
	const [activeIndexImage, setActiveIndexImage] = useState(0);
	const scrollRef = useRef(null);

	useEffect(() => {
		setLike(!!post.likes?.includes(user?._id));
	}, [post.likes, user?._id]);

	const toggleLike = async () => {
		const oldlikestatus = like;
		setLike(!like);
		setLoadinglike(true);
		try {
			if (!oldlikestatus) {
				post.likes.push(user._id);
				await axios.post(`api/post/${post._id}/like`);
			} else {
				post.likes.pop(user._id);
				await axios.post(`api/post/${post._id}/unlike`);
			}
		} catch (error) {
			console.log("likeerror", error);
		}
		setLoadinglike(false);
	};

	const handleScroll = () => {
		if (scrollRef.current) {
			const { scrollLeft, offsetWidth } = scrollRef.current;
			// Calculate index by dividing current scroll position by item width
			const index = Math.round(scrollLeft / offsetWidth);
			setActiveIndexImage(index);
		}
	};
	const scrollTo = (index) => {
		scrollRef.current.scrollTo({
			left: index * scrollRef.current.offsetWidth,
			behavior: "smooth",
		});
	};

	return (
		<div className="border border-border rounded-lg p-4 space-y-3 bg-card">
			{/* User Section */}
			<div className="flex items-center gap-3 justify-between">
				<div className="flex items-center gap-3">
					<Avatar className="h-10 w-10">
						<AvatarImage src={post.user.profile.avatar} />
						<AvatarFallback>
							{post.user.name?.charAt(0)}
						</AvatarFallback>
					</Avatar>
					<div>
						<p className="font-semibold text-sm">
							{post.user.name}
						</p>
						<p className="text-xs text-muted-foreground">
							{post.createdAt
								? formatDistanceToNow(
										new Date(post.createdAt),
										{ addSuffix: true },
									)
								: "Just now"}
						</p>
					</div>
				</div>
				{/* <button className="text-muted-foreground hover:text-foreground">
					•••
				</button> */}
			</div>

			{/* Title */}
			<h3 className="font-semibold text-base">{post.title}</h3>

			{/* Description */}
			<p
				className={`text-sm text-muted-foreground leading-relaxed cursor-text ${
					!isExpanded && "line-clamp-2"
				}`}
				onClick={() => setIsExpanded(!isExpanded)}
			>
				{post.description}
			</p>

			{/* Image Carousel */}
			{post.images && post.images.length > 0 ? (
				<div>
					<div
						className="flex gap-2 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 no-scrollbar"
						ref={scrollRef}
						onScroll={handleScroll}
					>
						{post.images.map((image, index) => (
							<div
								key={index}
								className="shrink-0 snap-center rounded overflow-hidden aspect-square w-full"
							>
								<img
									src={image || "./default-avatar.svg"}
									alt={`Post ${index}`}
									className="h-full w-full object-cover cursor-pointer"
								/>
							</div>
						))}
					</div>
					<div className="flex justify-center items-center gap-2 mt-4">
						{post.images.map((_, i) => (
							<button
								key={i}
								onClick={() => scrollTo(i)}
								className={`h-2 rounded-full transition-all duration-300 cursor-pointer ease-in-out ${activeIndexImage === i ? "w-8 bg-chart-1 opacity-100" : "w-2 bg-gray-400 opacity-50 hover:opacity-100"}`}
								aria-label={`Go to slide ${i + 1}`}
							/>
						))}
					</div>
				</div>
			) : null}

			{/* Tags */}
			{post.tags && post.tags.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{post.tags.map((tag, index) => (
						<Badge
							key={index}
							variant="outline"
							className="text-xs cursor-pointer"
						>
							{tag}
						</Badge>
					))}
				</div>
			)}

			{/* Actions */}
			<div className="grid grid-cols-3 place-items-center  pt-2 border-t border-border text-sm text-muted-foreground">
				<button
					// className={`flex gap-2 hover:text-foreground transition-colors  ${loadinglike ? "cursor-progress" : "cursor-pointer"}`}
					className="flex gap-2 hover:text-foreground transition-colors cursor-pointer disabled:cursor-progress"
					disabled={loadinglike}
					onClick={toggleLike}
				>
					<Heart className="w-4 h-4" fill={like ? "red" : null} />
					{post.likes?.length || 0}
				</button>
				<button
					className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer"
					onClick={() => setCommentIdPost(post._id)}
				>
					<MessageCircle className="w-4 h-4" />
					{post.comments?.length || 0}
				</button>
				<button className="flex items-center gap-2 hover:text-foreground transition-colors cursor-pointer">
					<Share2 className="w-4 h-4" />
				</button>
			</div>
		</div>
	);
};
