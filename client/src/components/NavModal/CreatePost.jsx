import s from "./NavModal.module.scss";
import { uploader, emoji } from "../../assets";
import EmojiPicker from "emoji-picker-react";
import PropTypes from "prop-types";
import toast, { Toaster } from "react-hot-toast";
import { useCreateOrEditPost } from "../../customHooks/postHooks";

export const CreatePost = ({ mode, post = null }) => {
  const {
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
  } = useCreateOrEditPost(mode, post);

  if (errors.image) toast.error(errors.image.message);
  if (errors.conten) toast.error(errors.content.message);
  if (errors.newContent) toast.error(errors.newContent.message);

  return (
    <form className={s.createPost} onSubmit={handleSubmit(onSubmit)}>
      <h2 className={s.formHeader}>
        <span className={s.headerText}>
          {mode === "create" ? "Create new post" : "Edit info"}
        </span>
        <button className={s.createPostBtn} type="submit">
          {mode === "create" ? "Share" : "Done"}
        </button>
      </h2>

      <div className={s.createPostMain}>
        <div
          className={
            mode === "create" ? s.imgUploadContainer : s.imgUploadContainerEdit
          }
        >
          {!preview && (
            <img className={s.uploaderImg} src={uploader} alt="upload file" />
          )}

          {mode === "create" && (
            <input
              {...register("image", {
                required: "Image is required",
              })}
              className={s.fileInputCreate}
              type="file"
              id="createInput"
              onChange={(e) => handleFileChange(e)}
            />
          )}

          {preview && (
            <img className={s.imgUploadPreview} src={preview} alt="preview" />
          )}
        </div>

        <div className={s.contentSide}>
          <div className={s.writePost}>
            {mode === "create" && (
              <textarea
                {...register("content", {
                  required: "Content is required",
                  maxLength: 2200,
                })}
                placeholder="Write your post here"
                className={s.createPostInput}
                maxLength={2200}
                name="content"
                id="createPostContent"
              ></textarea>
            )}
            {mode === "edit" && (
              <textarea
                {...register("newContent", {
                  required: "Content is required",
                  maxLength: 2200,
                })}
                placeholder="Write your post here"
                className={s.createPostInput}
                maxLength={2200}
                id="editPostContent"
              ></textarea>
            )}

            <img
              onClick={() => {
                setShowEmoji(!showEmoji);
              }}
              style={{
                backgroundColor: showEmoji ? "rgb(239, 219, 105)" : "white",
              }}
              className={s.emojiBtn}
              src={emoji}
              alt="emoji picker"
            />
            <div className={s.symbols}>{currentContent.length}/2 200</div>
            {showEmoji && (
              <div className={s.emojiPicker}>
                <EmojiPicker
                  width={300}
                  height={300}
                  searchDisabled={true}
                  onEmojiClick={onEmojiClick}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <Toaster />
    </form>
  );
};

CreatePost.propTypes = {
  mode: PropTypes.string,
  post: PropTypes.object,
};
