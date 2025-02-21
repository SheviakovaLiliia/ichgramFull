import s from "./ProfileInfo.module.scss";
import Avatar from "react-avatar";
import PropTypes from "prop-types";
import { websiteIcon } from "../../assets";
import { Link } from "react-router-dom";
import { useState } from "react";

import toast, { Toaster } from "react-hot-toast";
import { useProfile } from "../../customHooks/userHooks";

export const ProfileInfo = () => {
  const [isFullText, setIsFullText] = useState(false);
  const {
    user,
    isLoadingUser,
    isFetchingUser,
    errorUser,
    handleFollowClick,
    handleLogout,
    handlePrefetchChat,
  } = useProfile();

  if (errorUser) toast.error("Something went wrong..");
  if (errorUser) return <p>Something went wrong...</p>;
  if (isLoadingUser || isFetchingUser) return <p className="loaderS"></p>;

  return (
    <div className={s.profileInfo}>
      <div className={s.profileImgContainer}>
        <Avatar
          className={s.avatar}
          src={user?.profile_image}
          size="150"
          round={true}
        />
      </div>
      <div className={s.info}>
        <div className={s.header}>
          <p>{user?.username}</p>
          {user?.isOwner ? (
            <div className={s.btns}>
              <Link to={`/profile/${user?.username}/edit`}>
                <button className={s.editBtn}>Edit profile</button>
              </Link>
              <button onClick={handleLogout} className={s.editBtn}>
                Log out
              </button>
            </div>
          ) : (
            <div className={s.btns}>
              <button className={s.followBtn} onClick={handleFollowClick}>
                {user?.isFollowedByOwner ? "Unfollow" : "Follow"}
              </button>

              <Link
                onMouseEnter={() => handlePrefetchChat(user.username)}
                to={`/messages/${user.username}`}
              >
                <button className={s.messageBtn}>Message</button>
              </Link>
            </div>
          )}
        </div>
        <div className={s.countedInfo}>
          <div>
            <span>{user?.post_count} </span>posts
          </div>
          <div>
            <span>{user?.followers_count} </span>followers
          </div>
          <div>
            <span>{user?.followings_count} </span>following
          </div>
        </div>
        <div className={s.description}>
          <div className={s.bio}>
            {isFullText ? user.bio : user.bio.substring(0, 90).trim() + "..."}{" "}
            <span
              onClick={() => {
                setIsFullText(!isFullText);
              }}
              className={s.more}
            >
              {isFullText ? "<<" : "more"}
            </span>
          </div>
          <div className={s.website}>
            <img src={websiteIcon} alt="website icon" />
            <p>{user.bio_website}</p>
          </div>
        </div>
        {/* <div></div> */}
      </div>
      <Toaster />
    </div>
  );
};

ProfileInfo.propTypes = {
  user: PropTypes.object.isRequired,
};
