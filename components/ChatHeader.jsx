import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export const ChatHeader = ({ context }) => {
  const navigation = useNavigation();
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.backButton}>←</Text>
      </TouchableOpacity>
      <Text style={styles.title}>{context} </Text>
      <View style={styles.placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E5EA',
    },
    backButtonContainer: {
      paddingRight: 16,
      justifyContent: 'center', 
      alignItems: 'center', 
    },
    backButton: {
      fontSize: 24,
      lineHeight: 24, 
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      flex: 1,
      textAlign: 'center',
    },
    placeholder: {
      width: 24, 
    },
  
   
  });