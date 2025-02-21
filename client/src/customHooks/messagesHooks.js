import { useEffect, useRef, useState } from "react";
import { useOutletContext, useParams } from "react-router";
import { io } from "socket.io-client";
import { useGetMessagesQuery, useGetChatInfoQuery } from "../services/chatApi";

export const useMessages = () => {
  const socket = io("http://localhost:5000", {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    withCredentials: true,
    transports: ["websocket"],
  });

  const { user } = useOutletContext();
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { username } = useParams();

  const messagesEndRef = useRef(null);
  const {
    data: chat,
    isLoading,
    isFetching,
    error,
  } = useGetChatInfoQuery(username);

  const {
    data: messagesData = [],
    isLoading: isLoadingM,
    isFetching: isFetchingM,
    isSuccess: isMessagesFetched,
    refetch,
  } = useGetMessagesQuery(username);

  let chatId;

  if (chat) {
    chatId = chat._id;
    console.log(chat);
  }
  useEffect(() => {
    if (messagesData && isMessagesFetched) {
      const refetchMessages = async () => {
        try {
          setMessages([]);
          await refetch(username).unwrap();
          if (messagesData)
            setMessages((prevMes) => [...prevMes, ...messagesData]);
        } catch (error) {
          console.error("Error refetching messages: ", error);
        }
      };

      if (messages.length > 0) {
        refetchMessages();
      } else {
        setMessages((prevMes) => [...prevMes, ...messagesData]);
      }
      console.log(messages);
    }
  }, [username, messagesData]);

  useEffect(() => {
    if (chatId) {
      // Join the chat room
      socket.emit("joinRoom", chatId);
      console.log("Room joined...");
    }

    // Listen for new messages
    socket.on("receiveMessage", (message) => {
      if (message) {
        if (message) {
          setMessages((prevMessages) => [...prevMessages, message]);
        }
      }

      console.log("Receive message...", message);
      console.log(message._id);
    });

    return () => {
      if (chatId) {
        socket.emit("leaveRoom", chatId);
        console.log("Room leaved...");
      }
      socket.off("receiveMessage");
    };
  }, [chatId]);

  const onInputKeyDown = async (e) => {
    if (e.key === "Enter" && newMessage) {
      if (!chat?.receiver) return;

      socket.emit("sendMessage", {
        authorId: user._id,
        receiverId: chat?.receiver._id,
        content: newMessage,
      });
      setNewMessage("");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return {
    chat,
    isLoading,
    isFetching,
    error,
    user,
    username,
    isFetchingM,
    isLoadingM,
    messages,
    chatId,
    onInputKeyDown,
    newMessage,
    setNewMessage,
    messagesEndRef,
  };
};
