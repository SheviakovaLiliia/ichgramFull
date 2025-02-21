import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import {
  useFollowUserMutation,
  useUnfollowUserMutation,
  userApi,
  useLazyGetMeQuery,
} from "../services/userApi";
import {
  useGetPostQuery,
  useAddCommentMutation,
  useLikePostMutation,
  useUnlikePostMutation,
  useGetCommentsQuery,
  commentsAdapter,
  useLikeCommentMutation,
  useUnLikeCommentMutation,
  useDeleteCommentMutation,
  useDeletePostMutation,
  useCreatePostMutation,
  useUpdatePostMutation,
} from "../services/postApi";

import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { navContext } from "../context/navContext";
import toast from "react-hot-toast";

export const useGetPost = () => {
  const { postId } = useParams();

  const {
    data: post,
    isLoading,
    isFetching,
    isSuccess,
    error,
  } = useGetPostQuery(postId);

  const {
    data: commentsData,
    isLoading: isLoadingC,
    isFetching: isFetchingC,
    error: errorC,
  } = useGetCommentsQuery(postId);

  const comments = commentsData
    ? commentsAdapter.getSelectors().selectAll(commentsData)
    : [];

  const { navState } = useContext(navContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    setFocus,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  const closeModal = () => {
    navigate(-1);
  };

  const onEmojiClick = (emojiData) => {
    const currentContent = watch("content") || "";
    const newContent = currentContent + emojiData.emoji;
    setValue("content", newContent);
  };

  const [addComment] = useAddCommentMutation();
  const [likePost] = useLikePostMutation();
  const [unLikePost] = useUnlikePostMutation();

  const [followUser] = useFollowUserMutation();
  const [unfollowUser] = useUnfollowUserMutation();

  console.log(post);

  const [isFollowed, setIsFollowed] = useState(
    post?.isAuthorFollowedByUser || null
  );

  useEffect(() => {
    if (isSuccess) {
      setIsFollowed(post?.isAuthorFollowedByUser);
    }
  }, [isSuccess, post]);

  const handleFollowClick = async () => {
    setIsFollowed((prev) => !prev);
    try {
      isFollowed
        ? await unfollowUser(post.author.username).unwrap()
        : await followUser(post.author.username).unwrap();
    } catch (error) {
      console.error("Follow error:", error);
      toast.error("Follow error");
    }
  };

  const handleLikeClick = async () => {
    try {
      post?.isLikedByUser
        ? await unLikePost(post._id).unwrap()
        : await likePost(post._id).unwrap();
    } catch (error) {
      console.error("Like error:", error);
      toast.error("Like error");
    }
  };

  const onComment = async (data) => {
    try {
      if (post) {
        await addComment({
          postId: post?._id,
          credentials: data,
        }).unwrap();
        reset();
      }
    } catch (error) {
      console.error("Could not add comment", error);
      toast.error("Error edding comment");
    }
  };

  useEffect(() => {
    if (navState === "c") {
      closeModal();
    }
  }, [navState]);

  console.log(comments);

  return {
    post,
    isLoading,
    isLoadingC,
    isFetching,
    isFetchingC,
    error,
    errorC,
    isSuccess,
    comments,
    navState,
    location,
    isMoreOpen,
    setIsMoreOpen,
    showEmojiPicker,
    setShowEmojiPicker,
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    setFocus,
    errors,
    closeModal,
    isFollowed,
    onEmojiClick,
    handleFollowClick,
    handleLikeClick,
    onComment,
  };
};

export const useGetPostCard = (postId) => {
  const location = useLocation();

  const { data: post, isLoading, isFetching, error } = useGetPostQuery(postId);
  const [likePost] = useLikePostMutation();
  const [unLikePost] = useUnlikePostMutation();

  const dispatch = useDispatch();
  const [isFullText, setIsFullText] = useState(false);

  const handleLikeClick = async () => {
    try {
      post?.isLikedByUser
        ? await unLikePost(post._id).unwrap()
        : await likePost(post._id).unwrap();
    } catch (error) {
      console.error("Error liking/unliking post:", error);
      toast.error("Like error");
    }
  };

  const handlePrefetchUser = () => {
    dispatch(
      userApi.util.prefetch("getUser", post.author.username, { force: true })
    );
  };

  return {
    location,
    post,
    isLoading,
    isFetching,
    error,
    isFullText,
    setIsFullText,
    handleLikeClick,
    handlePrefetchUser,
  };
};

export const useComment = (comment) => {
  const { postId } = useParams();
  const [likeComment] = useLikeCommentMutation();
  const [unlikeComment] = useUnLikeCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();

  const handleDeleteClick = async () => {
    try {
      await deleteComment({ commentId: comment._id, postId }).unwrap();
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Error deleting comment");
    }
  };

  const handleLikeClick = async () => {
    try {
      comment?.isLikedByUser
        ? await unlikeComment({ commentId: comment._id, postId }).unwrap()
        : await likeComment({ commentId: comment._id, postId }).unwrap();
    } catch (error) {
      console.error("Like error:", error);
      toast.error("Like error");
    }
  };

  return {
    handleLikeClick,
    handleDeleteClick,
  };
};

export const usePostActions = (post) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [mode, setMode] = useState("select");
  const [copied, setCopied] = useState(false);

  const [deletePost] = useDeletePostMutation();

  const onDeletePost = async () => {
    try {
      deletePost(post._id).unwrap();
      toast.success("Post deleted successfully");
      navigate(-1);
    } catch (error) {
      console.error("Error deleting post: ", error);
      toast.error("Error deleting post");
    }
  };

  return {
    location,
    mode,
    setMode,
    copied,
    setCopied,
    onDeletePost,
    navigate,
  };
};

export const useCreateOrEditPost = (mode, post = null) => {
  const { setIsNavModalOpen } = useContext(navContext);
  const [showEmoji, setShowEmoji] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      newContent: post?.content || "",
    },
  });

  const [createPost] = useCreatePostMutation();
  const [updatePost] = useUpdatePostMutation();
  const [getMe] = useLazyGetMeQuery();

  const currentContent =
    mode === "create" ? watch("content") || "" : watch("newContent") || "";

  const onEmojiClick = (emojiData) => {
    setValue("content", currentContent + emojiData.emoji, {
      shouldValidate: true,
    });
  };

  const [preview, setPreview] = useState(mode === "edit" ? post?.image : null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    console.log(file);
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    const formData = new FormData();
    if (mode === "create") {
      try {
        if (data.image) {
          formData.append("image", data.image[0]);
        }

        formData.append("content", data.content);
        // console.log(formData);
        await createPost(formData).unwrap();
        await getMe().unwrap();

        reset();
        toast.success("Post created successfully");
        setIsNavModalOpen(false);
      } catch (error) {
        console.error("Failed create post: ", error);
        toast.error("Failed create post");
      }
    } else {
      try {
        await updatePost({
          postId: post?._id,
          credentials: { content: data.newContent },
        }).unwrap();

        reset();
        toast.success("Successfully updated");
        navigate(-1);
      } catch (error) {
        console.error("Failed update post: ", error);
        toast.error("Failed update post");
      }
    }
  };

  return {
    showEmoji,
    setShowEmoji,
    register,
    handleSubmit,
    errors,
    currentContent,
    onEmojiClick,
    preview,
    handleFileChange,
    onSubmit,
  };
};
