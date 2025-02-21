import s from "./Pages.module.scss";
import { Layout } from "../layouts";
import { Outlet, useParams, Link } from "react-router-dom";
import { useGetUserChatsQuery } from "../services/chatApi";
import { useGetMeQuery } from "../services/userApi";
import { messages } from "../assets";
import Avatar from "react-avatar";
import { useState, useEffect } from "react";
import { formatDate } from "../utils/dateUtils";
import CommentSkeleton from "../components/Skeletons/CommentSkeleton";

export const ChatPage = () => {
  const { data: user } = useGetMeQuery();
  const {
    data: chats,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetUserChatsQuery();

  // const [chats, setChats] = useState<Chat[]>([]);
  // const user: UserState = useSelector((state: RootState) => state.user);
  const { username } = useParams();

  useEffect(() => {
    refetch();
    //     // const getChats = async() => {
    //     //     const result = await fetchUserChats();
    //     //     if (!result) return;
    //     //     setChats(result);
    //     // }
    //     // if (chats.length === 0) getChats();
  }, [username]);

  console.log(chats);

  // if (isLoading) return <CommentSkeleton />;
  // if (isFetching) return <CommentSkeleton />;
  if (error) return <p>Something went wrong...</p>;

  return (
    <Layout>
      <main className={s.chatPage}>
        <div className={s.chatList}>
          <h2>{user?.username}</h2>
          <div className={s.chats}>
            {(isLoading || isFetching) && <CommentSkeleton />}
            {/* {isFetching && <CommentSkeleton />} */}
            {chats?.length > 0 &&
              chats?.map((chat) => {
                const chatUsername =
                  chat?.user1?.username === user?.username
                    ? chat?.user2.username
                    : chat.user1.username;

                // Add gray background class if this chat is selected
                const isActive = username === chatUsername;

                return (
                  <Link
                    to={`/messages/${chatUsername}`}
                    key={chat._id}
                    className={s.chatLink}
                    style={{
                      backgroundColor: isActive ? "#efefef" : "#ffffff",
                    }}
                  >
                    <Avatar
                      src={
                        chat?.user1?.username === user?.username
                          ? chat.user2.profile_image
                          : chat.user1.profile_image
                      }
                      size="56"
                      round={true}
                    />

                    <div className={s.chatText}>
                      <p className={s.chatUsername}>{chatUsername}</p>
                      {chat?.last_message ? (
                        <p className={s.chatInfo}>
                          {chat?.last_message?.author?.username ===
                          user?.username
                            ? "You"
                            : chat?.last_message?.author?.username}{" "}
                          sent a message. ·{" "}
                          {formatDate(chat?.last_message?.createdAt)}
                          {/* {formatDate(new Date(chat?.last_message?.createdAt))} */}
                        </p>
                      ) : (
                        <p className={s.chatInfo}>No messages yet</p>
                      )}
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
        <div className={s.chatMain}>
          {!username && (
            <div className={s.msgWelcome}>
              <img src={messages} alt="messages" />
              <h3> Your messages </h3>
            </div>
          )}
          <Outlet context={{ user }} />
        </div>
      </main>
    </Layout>
  );
};
