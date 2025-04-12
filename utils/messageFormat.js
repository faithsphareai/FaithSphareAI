export const formatMessage = (text, sender) => ({
  id: Date.now().toString(),
  text,
  sender,
  timestamp: new Date().toISOString(),
});
