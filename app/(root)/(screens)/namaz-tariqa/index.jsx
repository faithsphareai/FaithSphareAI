import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, Image, StyleSheet } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { Fajr, Dhuhr, Asr, Maghrib, Isha } from '../../../../constants/icons';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrayerScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleBack = () => {
    router.back();
  };

  const prayers = [
    { title: 'Fajr', icon: Fajr },
    { title: 'Dhuhr', icon: Dhuhr },
    { title: 'Asr', icon: Asr },
    { title: 'Maghrib', icon: Maghrib },
    { title: 'Isha', icon: Isha },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#15803d" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Prayer Guide
        </Text>
        <View style={styles.headerSpace} />
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.gridContainer}>
          {prayers.map((prayer) => (
            <Animated.View
              key={prayer.title}
              style={[
                styles.gridItem,
                {
                  opacity: fadeAnim,
                  transform: [
                    {
                      translateY: fadeAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [50, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                onPress={() => router.push(`/namaz-tariqa/${prayer.title}`)}
                style={styles.prayerCard}
              >
                <Image source={prayer.icon} style={styles.prayerIcon} />
                <Text style={styles.prayerTitle}>
                  {prayer.title}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0fdf4', // bg-green-50
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb', // border-gray-200
    backgroundColor: '#f0fdf4', // bg-green-50
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#15803d', // text-green-800
  },
  headerSpace: {
    width: 24,
  },
  scrollView: {
    padding: 16,
    backgroundColor: '#ffffff',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '45%',
    marginBottom: 16,
  },
  prayerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e5e7eb', // border-gray-200
    alignItems: 'center',
    padding: 16,
  },
  prayerIcon: {
    width: 48,
    height: 48,
    marginBottom: 8,
  },
  prayerTitle: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});