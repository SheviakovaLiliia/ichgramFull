import s from "./EditProfileForm.module.scss";
import { websiteIcon } from "../../assets";
import Avatar from "react-avatar";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { Toaster } from "react-hot-toast";
import { useEditProfile } from "../../customHooks/userHooks";

export const EditProfileForm = () => {
  const {
    cropData,
    register,
    handleSubmit,
    watch,
    errors,
    showCropper,
    isLoading,
    isFetching,
    preview,
    isLoadingUpdating,
    errorUpdating,
    isSuccess,
    handleFileChange,
    cropImage,
    onSubmit,
    user,
    cropperRef,
    setShowCropper,
    setPreview,
  } = useEditProfile();

  if (isLoading || isFetching) return <p className="loaderS"></p>;

  return (
    <>
      <form className={s.editForm} onSubmit={handleSubmit(onSubmit)} action="">
        <div className={s.changeImg}>
          <div className={s.preview}>
            <Avatar src={cropData || preview} size="56" round={true} />

            <div className={s.info}>
              <h2>{user?.username}</h2>
              <p>{user?.bio}</p>
            </div>
          </div>
          <input
            {...register("profileImage")}
            type="file"
            style={{ display: "none" }}
            id="file-upload"
            onChange={(e) => handleFileChange(e)}
          />
          <label
            style={{ width: 114 }}
            className={s.uploadImgBtn}
            htmlFor="file-upload"
            // disabled={isLoadingUpdating || isSuccess}
          >
            New photo
          </label>
        </div>
        <label className={s.label} htmlFor="">
          Username
          <input
            {...register("username", {
              required: "Username is required",
              maxLength: 120,
            })}
            className={s.usernameInput}
            type="text"
          />
        </label>
        {errors.username && (
          <p className={s.error}>{errors.username.message}</p>
        )}
        <label className={s.label} htmlFor="">
          Website
          <input
            {...register("website", { maxLength: 120 })}
            className={s.websiteInput}
            type="text"
          />
          <img className={s.websiteIcon} src={websiteIcon} alt="website icon" />
        </label>
        {errors.website && <p className={s.error}>{errors.website.message}</p>}
        <label className={s.label} htmlFor="">
          About
          <textarea
            {...register("about", { maxLength: 150 })}
            className={s.abouInput}
            type="text"
            name="about"
            id="aboutInput"
            maxLength="150"
          ></textarea>
          <div className={s.symbols}>{watch("about").length}/150</div>
        </label>
        {errors.about && <p className={s.error}>{errors.about.message}</p>}
        <button
          disabled={isLoadingUpdating || isSuccess}
          type="submit"
          className={s.saveBtn}
          style={{ width: 268 }}
        >
          {isSuccess ? "Saved" : "Save"}
        </button>
        {errorUpdating && (
          <div
            style={{ marginTop: 20, backgroundColor: "white" }}
            className={s.globalError}
          >
            Something went wrong while updating profile
          </div>
        )}
      </form>

      {showCropper && preview && (
        <div
          className={s.cropperModal}
          onClick={() => {
            setShowCropper(false);
            setPreview(user?.profile_image);
          }}
        >
          <div
            className={s.cropperContainer}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Cropper
              src={preview}
              style={{
                height: 500,
                width: "100%",
              }}
              aspectRatio={1}
              guides={false}
              ref={cropperRef}
              viewMode={1}
              minCropBoxHeight={50}
              minCropBoxWidth={50}
              background={false}
            />
            <button className={s.cropBtn} type="button" onClick={cropImage}>
              Save & Continue
            </button>
          </div>
          <Toaster position="top-center" reverseOrder={true} />
        </div>
      )}
    </>
  );
};
