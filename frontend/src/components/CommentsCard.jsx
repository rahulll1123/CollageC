/** @format */

import { useEffect, useState, useRef, useContext, use } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { Heart, Reply, MessageCirclePlus, ChevronDown, X } from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { set } from "zod";

// Convert flat comments list to tree
const buildCommentTree = (flatComments) => {
	const map = {};
	const tree = [];
	// 1. Create a map of all comments
	flatComments.forEach((comment) => {
		map[comment._id] = { ...comment, replies: [] };
	});

	// 2. Link children to parents
	flatComments.forEach((comment) => {
		if (comment.parentComment && map[comment.parentComment]) {
			map[comment.parentComment].replies.push(map[comment._id]);
		} else if (!comment.parentComment) {
			// It's a top-level comment
			tree.push(map[comment._id]);
		}
	});
	return tree;
};

function CommentsCard({ postId, setCommentIdPost }) {
	const { user } = useContext(AuthContext);
	const cardRef = useRef(null);
	const inputRef = useRef(null);
	const [page, setPage] = useState(1);
	const [flatComments, setFlatComments] = useState([]);
	const [commentsTree, setCommentsTree] = useState([]);
	const [loading, setLoading] = useState(true);
	const [input, setInput] = useState("");
	const [replyTo, setReplyTo] = useState(null); // Stores the whole comment object or null
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isVisible, setIsVisible] = useState(false);

	// console.log(postId);

	useEffect(() => {
		setIsVisible(true);
	}, []);

	//Handle closing of Comment Card
	useEffect(() => {
		// 1. Function to check if the click was outside the card
		const handleClickOutside = (event) => {
			if (cardRef.current && !cardRef.current.contains(event.target)) {
				setIsVisible(false);
				setTimeout(() => setCommentIdPost(null), 300);
			}
		};
		const handleKeyDown = (event) => {
			if (event.key === "Escape") {
				setIsVisible(false);
				setTimeout(() => setCommentIdPost(null), 300);
			}
		};
		// 2. Attach the event listener to the whole document
		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("mousedown", handleClickOutside);

		// 3. CLEANUP: Remove the listener when the component unmounts
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [setCommentIdPost]);

	useEffect(() => {
		// console.log("comment tree Updated:", buildCommentTree(flatComments));
		setCommentsTree(buildCommentTree(flatComments));
	}, [flatComments]);

	//Handle api for Acuiring and building comment tree
	const fetchComments = async () => {
		try {
			const res = await axios.get(`/api/post/${postId}/comments`);
			// console.log(res.data);
			const tree = buildCommentTree(res.data);
			setFlatComments(res.data);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchComments();
	}, [postId]);

	// handles reply loading
	const updateReplies = async (commentId) => {
		try {
			const res = await axios.get(`/api/comment/${commentId}/reply`);
			setFlatComments((prev) => [...prev, ...res.data]);
			// console.log("Updated replies for comment", commentId, res.data);
		} catch (err) {
			console.error("Failed to fetch replies:", err);
			return [];
		}
	};

	// Handle reply to change focus
	useEffect(() => {
		if (replyTo && inputRef.current) {
			inputRef.current.focus();
		}
	}, [replyTo]);

	//Handle Comment and reply
	const handleSend = async () => {
		if (!input.trim() || isSubmitting) return;

		setIsSubmitting(true);
		try {
			const payload = {
				content: input,
				parentCommentId: replyTo?._id || null,
			};
			// console.log(payload);
			const res = await axios.post(
				`/api/post/${postId}/comments`,
				payload,
			);
			// console.log("Hello", res.data);
			let commentToAdd = res.data;
			commentToAdd.likeCount = 0;
			commentToAdd.hasLiked = false;
			commentToAdd.totalReplies = 0;
			commentToAdd.user = {
				_id: user.id,
				name: user.name,
				avatar: user.avatar,
			};
			setFlatComments((prev) => [...prev, commentToAdd]);
			// await fetchComments();

			setInput("");
			setReplyTo(null); // Reset reply state after sending
		} catch (err) {
			console.error("Failed to send:", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		// full screen blur
		<div
			className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-300 ${isVisible ? "backdrop-blur-sm bg-black/50" : "backdrop-blur-none bg-transparent"}`}>
			{/* card area */}
			<div
				ref={cardRef}
				className={`w-[95%] max-w-lg h-[80vh] bg-card rounded-xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ease-out ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
				{/* Header */}
				<div className="p-4 border-b flex justify-between items-center">
					<h3 className="font-bold text-lg">Discussion</h3>
					<button
						onClick={() => {
							setIsVisible(false);
							setTimeout(() => setCommentIdPost(null), 300);
						}}
						className="text-xl cursor-pointer">
						<X />
					</button>
				</div>

				{/* All Comments*/}
				<div className="flex-1 overflow-y-auto p-4 space-y-4">
					{loading ? (
						<p className="text-center text-sm">Loading thread...</p>
					) : commentsTree.length > 0 ? (
						commentsTree.map((comment) => (
							<CommentItem
								key={comment._id}
								comment={comment}
								setReplyTo={setReplyTo}
								updateReplies={updateReplies}
							/>
						))
					) : (
						<p className="text-center text-muted-foreground">
							Be the first to comment!
						</p>
					)}
				</div>
				{/* footer */}
				<div className="flex flex-col border-t bg-card p-2">
					{/* 1. Reply Preview (shows only when replying) */}
					{replyTo && (
						<div className="flex items-center justify-between bg-card px-3 py-1 rounded-t-md mb-1 border-l-4 border-blue-500">
							<div className="flex flex-col overflow-hidden">
								<span className="text-[10px] font-bold text-text-600">
									Replying to {replyTo.user?.name}
								</span>
								<p className="text-xs text-slate-500 truncate italic">
									"{replyTo.content}"
								</p>
							</div>
							<button
								onClick={() => setReplyTo(null)}
								className="text-slate-400 hover:text-red-500 ml-2 cursor-pointer">
								✕
							</button>
						</div>
					)}

					{/* 2. Input Field Area */}
					<div className="flex flex-row items-center gap-2 p-2 bg-input rounded-lg">
						<input
							type="text"
							placeholder={
								replyTo
									? "Write a reply..."
									: "Write a comment..."
							}
							className="flex-1 bg-transparent border-none focus:ring-0 text-sm outline-none"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							onKeyDown={(e) => e.key === "Enter" && handleSend()}
							ref={inputRef}
						/>

						<button
							onClick={handleSend}
							disabled={!input.trim() || isSubmitting}
							className={`transition-transform active:scale-90 ${
								input.trim()
									? "text-foreground cursor-pointer"
									: "text-muted-foreground cursor-default"
							}`}>
							<MessageCirclePlus size={24} strokeWidth={2.5} />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

const CommentItem = ({ comment, setReplyTo, updateReplies }) => {
	const { user } = useContext(AuthContext);
	const [like, setLike] = useState(null);
	const [loadingLike, setLoadinglike] = useState(false);
	const [likeCount, setLikeCount] = useState(comment.likeCount || 0);

	const [replyLoading, setReplyLoading] = useState(false);
	useEffect(() => {
		if (user && comment.hasLiked !== undefined) {
			setLike(!!comment.hasLiked);
		}
	}, []);

	const toggleLike = async () => {
		const oldlikestatus = like;
		setLike(!like);
		setLoadinglike(true);
		try {
			if (!oldlikestatus) {
				await axios.post(`api/comment/${comment._id}/like`);
				setLikeCount((prev) => prev + 1);
			} else {
				await axios.delete(`api/comment/${comment._id}/like`);
				setLikeCount((prev) => prev - 1);
			}
		} catch (error) {
			console.log("likeerror", error);
		}
		setLoadinglike(false);
	};

	return (
		<div className="flex flex-col gap-3 ml-2 border-l-2 border-border pl-4 py-2">
			<div className="flex items-center justify-between">
				<div className="flex flex-col">
					<div className="flex items-center gap-2">
						<Avatar className="h-8 w-8 cursor-pointer">
							<AvatarImage src={comment.user.avatar} />
							<AvatarFallback>
								{comment.user.name?.charAt(0)}
							</AvatarFallback>
						</Avatar>
						<span className="font-bold text-xs">
							{comment.user?.name || "Anonymous"}
						</span>

						<span className="text-[10px] text-muted-foreground">
							{formatDistanceToNow(new Date(comment.createdAt), {
								addSuffix: true,
							})}
						</span>
					</div>

					<p className="text-sm mt-1 text-foreground-800">
						{comment.isDeleted ? (
							<span className="italic text-gray-400">
								This comment was deleted
							</span>
						) : (
							comment.content
						)}
					</p>

					<div className="flex gap-4 mt-2 text-xs text-muted-foreground">
						<button
							className="flex items-center gap-1 hover:text-primary cursor-pointer"
							onClick={toggleLike}
							disabled={loadingLike}>
							<Heart size={14} fill={like ? "red" : ""} />{" "}
							{likeCount || 0}
						</button>
						<button
							onClick={() => setReplyTo(comment)}
							className="flex items-center gap-1 hover:text-primary cursor-pointer">
							<Reply size={14} /> Reply
						</button>
					</div>
				</div>
				{comment.totalReplies > 0 && comment.replies.length == 0 && (
					<button
						onClick={() => {
							setReplyLoading(true);
							return updateReplies(comment._id);
						}}
						disabled={replyLoading}
						className="flex items-center gap-1 hover:text-primary cursor-pointer">
						<ChevronDown size={20} />
					</button>
				)}
			</div>

			{/* RECURSION HAPPENS HERE */}
			{comment.replies && comment.replies.length > 0 && (
				<div className="mt-2 space-y-2">
					{comment.replies.map((reply) => (
						<CommentItem
							key={reply._id}
							comment={reply}
							setReplyTo={setReplyTo}
							updateReplies={updateReplies}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export { CommentsCard };
