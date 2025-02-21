import s from "./NavModal.module.scss";
import { bin, closeLeft } from "../../assets";
import Avatar from "react-avatar";
import { formatDate } from "../../utils/dateUtils";
import {
  useGetNotificationsQuery,
  useDeleteNotificationMutation,
  useDeleteNotificationsMutation,
} from "../../services/notificationApi";
import { notificationsAdapter } from "../../services/notificationApi";
import toast, { Toaster } from "react-hot-toast";
import PropTypes from "prop-types";

export const Notifications = ({ closeModal }) => {
  const {
    data: notificationsData,
    isLoading: isLoadingN,
    isFetching: isFetchingN,
    error: errorN,
  } = useGetNotificationsQuery();
  const [deleteNotification] = useDeleteNotificationMutation();
  const [deleteAll] = useDeleteNotificationsMutation();

  const notifications = notificationsData
    ? notificationsAdapter.getSelectors().selectAll(notificationsData)
    : [];

  console.log(notifications);

  const handleDeleteNotification = async (id) => {
    try {
      toast.promise(deleteNotification(id), {
        loading: "Deleting...",
        success: <b>Deleted successfully </b>,
        error: <b>Failed to delete</b>,
      });
      await deleteNotification(id).unwrap();
    } catch (error) {
      console.error("Error deleting notification", error);
    }
  };

  const handleDeleteAllNotifications = async () => {
    try {
      toast.promise(deleteAll, {
        loading: "Deleting...",
        success: <b>Deleted successfully </b>,
        error: <b>Failed to delete</b>,
      });
      await deleteAll().unwrap();
    } catch (error) {
      console.error("Error deleting notification", error);
    }
  };

  if (isLoadingN || isFetchingN) return <p className="loaderS"></p>;
  if (errorN) return <p>Something went wrong...</p>;

  return (
    <div className={s.notifications}>
      <img
        className={s.closeModalBtn}
        onClick={closeModal}
        src={closeLeft}
        alt=""
      />
      {notifications.length > 0 && (
        <button
          onClick={handleDeleteAllNotifications}
          className={s.deleteAllBtn}
        >
          Delete All
        </button>
      )}
      <h1>Notifications</h1>
      <h2>New</h2>
      {notifications?.map((n) => (
        <div key={n._id} className={s.notification}>
          <div className={s.leftPart}>
            <Avatar src={n?.sender?.profile_image} size="44" round={true} />

            <p className={s.text}>
              <span className={s.username}>{n?.sender?.username}</span>{" "}
              {n?.type}{" "}
              <span className={s.time}>{formatDate(n?.createdAt)}</span>
            </p>
          </div>

          {n?.type.includes("post") && (
            <div className={s.imgContainer}>
              <img src={n?.post?.image} alt="post" />
            </div>
          )}

          <img
            src={bin}
            alt="delete"
            onClick={() => handleDeleteNotification(n?._id)}
            className={s.delete}
          />
        </div>
      ))}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

Notifications.propTypes = {
  closeModal: PropTypes.func,
};
