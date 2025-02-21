import s from "./PostComponents.module.scss";
import Avatar from "react-avatar";
import { like, liked, commentIcon } from "../../assets";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/dateUtils";
import PropTypes from "prop-types";
import PostCardSkeleton from "../Skeletons/PostCardSkeleton";
import { Toaster } from "react-hot-toast";
import { useGetPostCard } from "../../customHooks/postHooks";

export const PostCard = ({ postId }) => {
  const {
    location,
    post,
    isLoading,
    isFetching,
    error,
    isFullText,
    setIsFullText,
    handleLikeClick,
    handlePrefetchUser,
  } = useGetPostCard(postId);

  if (isLoading || isFetching) return <PostCardSkeleton />;
  if (error) return <p>Something went wrong...</p>;
  if (!post) return <PostCardSkeleton />;

  return (
    <div className={s.postCard}>
      <div className={s.userInfo}>
        <Link
          onMouseEnter={handlePrefetchUser}
          to={`/profile/${post.author.username}`}
        >
          <Avatar src={post?.author?.profile_image} size="27" round={true} />
        </Link>
        <Link
          onMouseEnter={handlePrefetchUser}
          to={`/profile/${post.author.username}`}
          className={s.username}
        >
          {post?.author?.username}
        </Link>

        <p className={s.date}>• {formatDate(post.createdAt)} •</p>
      </div>
      <div className={s.postImgContainer}>
        <img className={s.postImg} src={post?.image} alt="post img" />
      </div>
      <div className={s.reactions}>
        <img
          onClick={handleLikeClick}
          src={post?.isLikedByUser ? liked : like}
          alt="like"
        />
        <Link to={`/post/${post._id}`} state={{ backgroundLocation: location }}>
          <img src={commentIcon} alt="comment" />
        </Link>
      </div>
      <p className={s.likes}>{post?.like_count} likes</p>
      <div className={s.content}>
        {isFullText ? post?.content : post?.content.substring(0, 90).trim()}
        {post?.content?.length > 90 && post?.content?.length < 430 && (
          <span onClick={() => setIsFullText(!isFullText)} className={s.more}>
            {isFullText ? "   <<" : "... more"}
          </span>
        )}
        {post?.content?.length >= 430 && (
          <Link
            to={`/post/${post._id}`}
            state={{ backgroundLocation: location }}
            className={s.more}
          >
            ... more
          </Link>
        )}
      </div>

      <Link
        to={`/post/${post._id}`}
        state={{ backgroundLocation: location }}
        className={s.commentLink}
      >
        View all comments ({post?.comment_count})
      </Link>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

PostCard.propTypes = {
  postId: PropTypes.string,
};
