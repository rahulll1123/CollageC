/** @format */

import { useEffect, useState, useRef, useContext } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { Heart, Reply, MessageCirclePlus } from "lucide-react";
import { AuthContext } from "@/context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
	const cardRef = useRef(null);
	const inputRef = useRef(null);
	const [page, setPage] = useState(1);
	const [commentsTree, setCommentsTree] = useState([]);
	const [loading, setLoading] = useState(true);
	const [input, setInput] = useState("");
	const [replyTo, setReplyTo] = useState(null); // Stores the whole comment object or null
	const [isSubmitting, setIsSubmitting] = useState(false);
	// console.log(postId);

	//Handle closing of Comment Card
	useEffect(() => {
		// 1. Function to check if the click was outside the card
		const handleClickOutside = (event) => {
			if (cardRef.current && !cardRef.current.contains(event.target)) {
				setCommentIdPost(null);
			}
		};
		const handleKeyDown = (event) => {
			if (event.key === "Escape") {
				setCommentIdPost(null);
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

	//Handle api for Acuiring and building comment tree
	const fetchComments = async () => {
		try {
			const res = await axios.get(`/api/post/${postId}/comments`);
			const tree = buildCommentTree(res.data);
			setCommentsTree(tree);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		fetchComments();
	}, [postId]);

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
			console.log(payload);
			const res = await axios.post(
				`/api/post/${postId}/comments`,
				payload,
			);
			console.log("Hello", res);

			await fetchComments();

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
		<div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
			{/* card area */}
			<div className="w-[95%] max-w-lg h-[80vh] bg-card rounded-xl shadow-2xl flex flex-col overflow-hidden">
				{/* Header */}
				<div className="p-4 border-b flex justify-between items-center">
					<h3 className="font-bold text-lg">Discussion</h3>
					<button
						onClick={() => setCommentIdPost(null)}
						className="text-xl">
						✕
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
								className="text-slate-400 hover:text-red-500 ml-2">
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

const CommentItem = ({ comment, setReplyTo }) => {
	const { user } = useContext(AuthContext);
	const [like, setLike] = useState(null);
	const [loadingLike, setLoadinglike] = useState(false);
	useEffect(() => {
		setLike(comment.hasLiked);
	}, [comment.hasLiked, user?._id]);

	const toggleLike = async () => {
		const oldlikestatus = like;
		setLike(!like);
		setLoadinglike(true);
		try {
			if (!oldlikestatus) {
				await axios.post(`api/comments/${comment._id}/like`);
			} else {
				await axios.delete(`api/comments/${comment._id}/like`);
			}
		} catch (error) {
			console.log("likeerror", error);
		}
		setLoadinglike(false);
	};

	return (
		<div className="flex flex-col gap-3 ml-2 border-l-2 border-border pl-4 py-2">
			<div className="flex flex-col">
				<div className="flex items-center gap-2">
					<Avatar className="h-8 w-8">
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

				<p className="text-sm mt-1 text-slate-800">
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
						className="flex items-center gap-1 hover:text-blue-500"
						onClick={toggleLike}
						disabled={loadingLike}>
						<Heart size={14} fill={like ? "red" : ""} />{" "}
						{comment.likes?.length || 0}
					</button>
					<button
						onClick={() => setReplyTo(comment)}
						className="flex items-center gap-1 hover:text-blue-500">
						<Reply size={14} /> Reply
					</button>
				</div>
			</div>

			{/* RECURSION HAPPENS HERE */}
			{comment.replies && comment.replies.length > 0 && (
				<div className="mt-2 space-y-2">
					{comment.replies.map((reply) => (
						<CommentItem
							key={reply._id}
							comment={reply}
							setReplyTo={setReplyTo}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export { CommentsCard };
