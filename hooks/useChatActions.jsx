import { useChat } from '../context/ChatContext';
import { formatMessage } from '../utils/messageFormat';
import { saveChatHistory } from '../utils/chatStorage';
import { useAyatFinderMutation } from './useAyatFinderMutation';
import { useHadithFinderMutation } from './useHadithFinderMutation';
import { useQuizMutations } from './useQuizMutations';

export const useChatActions = () => {
  const { messages, setMessages, chatContext } = useChat();
  const ayatFinderMutation = useAyatFinderMutation();
  const hadithFinderMutation = useHadithFinderMutation();
  const { generateQuizMutation, gradeQuizMutation } = useQuizMutations();

  const startNewQuiz = async () => {
    const typingMessage = formatMessage('Typing', 'bot', { 
      isTyping: true,
      animatedText: true,
      dots: '...'
    });
    setMessages([typingMessage]);

    try {
      const response = await generateQuizMutation.mutateAsync('new topic');
      const botMessage = formatMessage(response, 'bot', { isQuestion: true });
      setMessages([botMessage]);
      await saveChatHistory(chatContext, [botMessage]);
    } catch (error) {
      const errorMessage = formatMessage(
        'Sorry, I encountered an error. Please try again.',
        'bot'
      );
      setMessages([errorMessage]);
    }
  };

  const sendMessage = async (text) => {
    const userMessage = formatMessage(text, 'user');
    setMessages(prevMessages => [...prevMessages, userMessage]);

    const typingMessage = formatMessage('Typing', 'bot', { 
      isTyping: true,
      animatedText: true,
      dots: '...'
    });
    setMessages(prevMessages => [...prevMessages, typingMessage]);

    let dotsCount = 0;
    const typingInterval = setInterval(() => {
      dotsCount = (dotsCount + 1) % 4;
      const dots = '.'.repeat(dotsCount);
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          msg.isTyping ? { ...msg, text: `Typing${dots}` } : msg
        )
      );
    }, 500);

    try {
      let response;
      
      if (chatContext === 'quiz') {
        // For quiz context, first generate a question, then grade the answer
        const lastBotMessage = messages.filter(m => m.sender === 'bot').pop();
        if (lastBotMessage?.isQuestion) {
          // If last message was a question, grade the answer
          response = await gradeQuizMutation.mutateAsync(text);
          // Generate next question after grading
          const nextQuestion = await generateQuizMutation.mutateAsync(text);
          response = `${response}\n\nNext Question:\n${nextQuestion}`;
        } else {
          // Generate first question
          response = await generateQuizMutation.mutateAsync(text);
        }
      } else if (chatContext === 'quran') {
        // Use Ayat Finder for Quran authentication
        response = await ayatFinderMutation.mutateAsync(text);
      } else if (chatContext === 'hadith') {
        // Use Hadith Finder for Hadith authentication
        response = await hadithFinderMutation.mutateAsync(text);
      } else {
        throw new Error(`Unsupported chat context: ${chatContext}`);
      }

      clearInterval(typingInterval);
      
      if (!response) {
        throw new Error('No response received from the API');
      }

      const botMessage = formatMessage(response, 'bot', {
        isQuestion: chatContext === 'quiz'
      });
      
      setMessages(prevMessages => 
        prevMessages
          .filter(msg => !msg.isTyping)
          .concat(botMessage)
      );

      await saveChatHistory(chatContext, [...messages, userMessage, botMessage]);
    } catch (error) {
      console.error('Chat action error:', error);
      clearInterval(typingInterval);
      
      const errorMessage = formatMessage(
        `Sorry, I encountered an error: ${error.message}. Please try again.`,
        'bot'
      );
      setMessages(prevMessages => 
        prevMessages
          .filter(msg => !msg.isTyping)
          .concat(errorMessage)
      );
    }
  };

  return { sendMessage, startNewQuiz };
};
