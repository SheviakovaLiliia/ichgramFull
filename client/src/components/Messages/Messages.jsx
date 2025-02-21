import s from "./Messages.module.scss";
import { Link } from "react-router";
import Avatar from "react-avatar";
import { formatMessagesDate, tenMin } from "../../utils/dateUtils";
import { useMessages } from "../../customHooks/messagesHooks";

export const Messages = () => {
  const {
    chat,
    isLoading,
    isFetching,
    error,
    user,
    username,
    isFetchingM,
    isLoadingM,
    messages,
    onInputKeyDown,
    newMessage,
    setNewMessage,
    messagesEndRef,
  } = useMessages();

  if (!user) return <p>Loading...</p>;

  if (isLoading || isLoadingM || isFetching || isFetchingM)
    return <p className="loaderS"></p>;

  if (error) return <p>Something went wrong... {error.status}</p>;

  if (!username) return <p>You have no messages here. Write a message</p>;

  return (
    <div className={s.messagesContainer}>
      <div className={s.chatHeader}>
        <Link
          className={s.headerContent}
          to={`/profile/${chat?.receiver?.username}`}
        >
          <Avatar src={chat?.receiver?.profile_image} size="44" round={true} />

          <p>{chat?.receiver?.username}</p>
        </Link>
      </div>

      <div className={s.chatBody}>
        <div className={s.receiverInfo}>
          <Link to={`/profile/${username}`}>
            <Avatar
              src={chat?.receiver?.profile_image}
              size="69"
              round={true}
            />
          </Link>
          <Link to={`/profile/${username}`}>
            <p className={s.receiverUsername}>{chat?.receiver?.username}</p>
          </Link>
          <Link to={`/profile/${username}`} className={s.viewProfileBtn}>
            View profile
          </Link>
        </div>

        <div className={s.messages}>
          {messages?.map((message, index, messages) => {
            const prevMessage = messages[index - 1];
            const showTime =
              !prevMessage ||
              new Date(message.createdAt).getTime() -
                new Date(prevMessage.createdAt).getTime() >
                tenMin;
            return (
              <div key={message._id}>
                {showTime && (
                  <div className={s.showTime}>
                    {formatMessagesDate(message.createdAt)}
                  </div>
                )}
                <div
                  className={
                    message?.author?.username === user?.username
                      ? s.messageContainerRight
                      : s.messageContainerLeft
                  }
                >
                  {message.author.username === user?.username ? (
                    <>
                      <p className={s.contentRight}>{message.content}</p>

                      <Avatar
                        src={user?.profile_image}
                        size="28"
                        round={true}
                      />
                    </>
                  ) : (
                    <>
                      <Avatar
                        src={message.author.profile_image}
                        size="28"
                        round={true}
                      />

                      <p className={s.contentLeft}>{message.content}</p>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef}></div>
        </div>
      </div>
      <input
        className={s.messageInput}
        placeholder="Write message"
        value={newMessage}
        onChange={(e) => {
          setNewMessage(e.target.value);
        }}
        onKeyDown={(e) => onInputKeyDown(e)}
      />
    </div>
  );
};
