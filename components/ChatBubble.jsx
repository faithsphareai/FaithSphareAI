import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

export const ChatBubble = ({ message, isUser }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date instanceof Date && !isNaN(date) 
      ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : '';
  };

  return (
    <View style={[
      styles.bubbleContainer,
      isUser ? styles.userBubbleContainer : styles.botBubbleContainer
    ]}>
      <View style={[
        styles.bubble,
        isUser ? styles.userBubble : styles.botBubble
      ]}>
        <Text style={[
          styles.messageText,
          isUser ? styles.userMessageText : styles.botMessageText
        ]}>
          {message.text}
        </Text>
        <Text style={[
          styles.timestamp,
          isUser ? styles.userTimestamp : styles.botTimestamp
        ]}>
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </View>
  );
};

ChatBubble.propTypes = {
  message: PropTypes.shape({
    text: PropTypes.string.isRequired,
    timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  isUser: PropTypes.bool.isRequired,
};


const styles = StyleSheet.create({
    bubbleContainer: {
      marginVertical: 4,
      maxWidth: '80%',
    },
    userBubbleContainer: {
      alignSelf: 'flex-end',
    },
    botBubbleContainer: {
      alignSelf: 'flex-start',
    },
    bubble: {
      padding: 12,
      borderRadius: 16,
    },
    userBubble: {
      backgroundColor: '#16a34a',
    },
    botBubble: {
      backgroundColor: '#E5E5EA',
    },
    messageText: {
      fontSize: 16,
    },
    userMessageText: {
      color: 'white',
    },
    botMessageText: {
      color: 'black',
    },
    timestamp: {
      fontSize: 10,
      marginTop: 4,
      opacity: 0.7,
    },
  
  });