import s from "./PostModal.module.scss";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { CreatePost } from "../NavModal/CreatePost";
import { CopyToClipboard } from "react-copy-to-clipboard";
import equal from "deep-equal";
import toast, { Toaster } from "react-hot-toast";
import { usePostActions } from "../../customHooks/postHooks";

export const PostActionsModal = ({ setIsMoreOpen, post }) => {
  const { location, mode, setMode, copied, setCopied, onDeletePost } =
    usePostActions(post);

  return (
    <div
      className={s.moreActionsModal}
      onClick={(e) => {
        e.stopPropagation();
        setIsMoreOpen(false);
      }}
    >
      <div className={s.moreActionsModalContainer}>
        {equal(mode, "select") && (
          <div
            className={s.moreActionsModalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              onClick={() => setMode("delete")}
              style={{ color: "#ED4956" }}
              className={s.moreActionsOption}
            >
              Delete
            </div>

            <div
              onClick={() => setMode("edit")}
              className={s.moreActionsOption}
            >
              Edit
            </div>

            <Link to={`/post/${post._id}`} className={s.moreActionsOption}>
              Go to post
            </Link>

            <CopyToClipboard text={location.pathname}>
              <div
                onClick={() => {
                  setCopied(true);
                  toast.success("Link copied successfully");
                  setIsMoreOpen(false);
                }}
                className={s.moreActionsOption}
                style={{ color: copied ? "green" : "#000000" }}
              >
                {copied ? "Copied" : "Copy link"}
              </div>
            </CopyToClipboard>

            <div
              className={s.moreActionsOption}
              onClick={() => {
                setIsMoreOpen(false);
              }}
            >
              Cancel
            </div>
          </div>
        )}
        {/* deleting window */}
        {equal(mode, "delete") && (
          <div className={s.moreActionsModalContent}>
            <div className={s.deletingHeader}>
              <h3>Delete post?</h3>
              <p>Are you sure you want to delete this post?</p>
            </div>
            <div
              className={s.moreActionsOption}
              style={{ color: "#ED4956" }}
              onClick={onDeletePost}
            >
              Delete
            </div>

            <div
              onClick={() => setMode("select")}
              className={s.moreActionsOption}
            >
              Cancel
            </div>
          </div>
        )}
        {/* creating window */}
        {equal(mode, "edit") && (
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className={s.editContainer}
          >
            <CreatePost mode="edit" post={post} />
          </div>
        )}
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

PostActionsModal.propTypes = {
  isMoreOpen: PropTypes.bool,
  setIsMoreOpen: PropTypes.func,
  post: PropTypes.object,
};
