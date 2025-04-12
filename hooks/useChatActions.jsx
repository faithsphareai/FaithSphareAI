import { useChat } from '../context/ChatContext';
import { formatMessage } from '../utils/messageFormat';
import { saveChatHistory } from '../utils/chatStorage';

export const useChatActions = () => {
  const { messages, setMessages, chatContext } = useChat();

  const sendMessage = async (text) => {
    const userMessage = formatMessage(text, 'user');
    const botMessage = formatMessage(`Response for ${chatContext}: ${text}`, 'bot');
    
    const newMessages = [...messages, userMessage, botMessage];
    setMessages(newMessages);
    await saveChatHistory(chatContext, newMessages);
  };

  return { sendMessage };
};
