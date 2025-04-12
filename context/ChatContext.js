import React, { createContext, useContext } from "react";
import { useChatHistory } from "../hooks/useChatHistory";

const ChatContext = createContext(null);

export const ChatProvider = ({ children, chatContext }) => {
  const { messages, setMessages } = useChatHistory(chatContext);

  return (
    <ChatContext.Provider
      value={{
        messages,
        setMessages,
        chatContext,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
