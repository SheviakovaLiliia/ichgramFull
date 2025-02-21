import s from "./PostModal.module.scss";
import { Link } from "react-router-dom";
import { like, liked } from "../../assets";
import Avatar from "react-avatar";
import PropTypes from "prop-types";
import { formatDate } from "../../utils/dateUtils";
import { Toaster } from "react-hot-toast";
import { useComment } from "../../customHooks/postHooks";

export const Comment = ({ comment }) => {
  const { handleLikeClick, handleDeleteClick } = useComment(comment);

  return (
    <div className={s.comment}>
      <Toaster position="top-center" reverseOrder={false} />
      <div className={s.commentLeft}>
        <Link to={`/profile/${comment?.author?.username}`}>
          <Avatar src={comment?.author?.profile_image} size="27" round={true} />
        </Link>

        <div className={s.commentBody}>
          <p className={s.commentText}>
            <span style={{ fontWeight: 500 }}>
              {comment?.author?.username + " "}
            </span>
            {comment?.content}
          </p>
          <div className={s.commentInfo}>
            <p className={s.date}>{formatDate(comment?.createdAt)}</p>
            <p> {comment?.like_count} likes</p>
            {comment?.isAuthor && (
              <p className={s.deleteComment} onClick={handleDeleteClick}>
                delete
              </p>
            )}
          </div>
        </div>
      </div>
      <img
        className={s.commentLike}
        onClick={handleLikeClick}
        src={comment?.isLikedByUser ? liked : like}
        alt={comment._id}
      />
    </div>
  );
};

Comment.propTypes = {
  comment: PropTypes.object.isRequired,
};

export default Comment;
