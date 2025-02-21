import s from "./Pages.module.scss";
import { Layout } from "../layouts";
import { Link } from "react-router-dom";
import CommentSkeleton from "../components/Skeletons/CommentSkeleton";
import React, { Suspense } from "react";
import { like, liked, commentIcon, emoji } from "../assets";
import EmojiPicker from "emoji-picker-react";
import Avatar from "react-avatar";
import { formatDate } from "../utils/dateUtils";
import { Toaster } from "react-hot-toast";
import { useGetPost } from "../customHooks/postHooks";

const Comment = React.lazy(() => import("../components/PostModal/Comment"));

export const PostPage = () => {
  const {
    post,
    isLoading,
    isLoadingC,
    isFetching,
    isFetchingC,
    error,
    errorC,
    comments,
    showEmojiPicker,
    setShowEmojiPicker,
    register,
    handleSubmit,
    setFocus,
    // errors,
    onEmojiClick,
    handleLikeClick,
    onComment,
  } = useGetPost();

  if (isLoading || isFetching || isLoadingC || isFetchingC)
    return <div className="loaderS"></div>;
  if (error || errorC) return <div>Something went wrong...</div>;
  if (!post) return <div>Something went wrong...</div>;
  return (
    <Layout>
      <main className={s.postPage}>
        <div className={s.postPageContent}>
          <div className={s.imageContainer}>
            <img className={s.postImg} src={post?.image} alt="post" />
          </div>
          <div className={s.interactiveSide}>
            {/* author part */}
            <div className={s.authorContainer}>
              <div className={s.authorInfo}>
                <Link to={`/profile/${post?.author?.username}`}>
                  <Avatar
                    src={post?.author?.profile_image}
                    size="27"
                    round={true}
                  />
                </Link>

                <p>{post?.author?.username} </p>
              </div>
            </div>
            {/* content part */}
            <div className={s.contentAndComments}>
              <div className={s.content}>
                <div className={s.photoSide}>
                  <Link to={`/profile/${post?.author?.username}`}>
                    <Avatar
                      src={post?.author?.profile_image}
                      size="27"
                      round={true}
                      className={s.avatar}
                    />
                  </Link>
                </div>
                <div className={s.contentSide}>
                  <p className={s.contentBody}>
                    <span>{post?.author?.username}</span> {post?.content}
                  </p>{" "}
                  <p className={s.date}>{formatDate(post?.createdAt)}</p>
                </div>
              </div>
              {/* comments part */}
              <div className={s.comments}>
                {/* <CommentSkeleton /> */}
                {comments?.map((comment) => (
                  <Suspense key={comment._id} fallback={<CommentSkeleton />}>
                    <Comment comment={comment} />
                  </Suspense>
                ))}
              </div>
            </div>
            {/* reactions part */}
            <div className={s.reactionsContainer}>
              <div className={s.reactions}>
                <img
                  src={post?.isLikedByUser ? liked : like}
                  onClick={handleLikeClick}
                  alt={post?._id}
                />
                <img
                  onClick={() => setFocus("content")}
                  src={commentIcon}
                  alt="comment"
                />
              </div>
              <p className={s.postLikes}>{[post?.like_count] + " "}likes</p>
              <p className={s.date}>{formatDate(post?.createdAt)}</p>
            </div>
            {/* write comment part */}
            <div className={s.writeComment}>
              <form className={s.form} onSubmit={handleSubmit(onComment)}>
                <img
                  className={s.emojiBtn}
                  src={emoji}
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  style={{
                    backgroundColor: showEmojiPicker
                      ? "rgb(239, 219, 105)"
                      : "white",
                  }}
                  alt="emoji picker"
                />
                {showEmojiPicker && (
                  <div className={s.emojiPicker}>
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                  </div>
                )}

                <input
                  {...register("content", { required: true, maxLength: 120 })}
                  className={s.commentInput}
                  placeholder="Add Comment"
                  type="text"
                />
                <button className={s.sendCommentBtn} type="submit">
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
        <Toaster position="top-center" reverseOrder={false} />
      </main>
    </Layout>
  );
};
