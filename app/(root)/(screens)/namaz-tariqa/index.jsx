import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Animated, Image } from 'react-native';
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
    <SafeAreaView className="flex-1 bg-green-50">
      <View className="flex-row items-center px-4  py-4 border-b bg-green-50 border-gray-200">
        <TouchableOpacity onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color="#15803d" />
        </TouchableOpacity>
        <Text className="flex-1 text-lg text-green-800 font-semibold text-center">
          Prayer Guide
        </Text>
        <View className="w-6" />
      </View>

      <ScrollView className="p-4 bg-white ">
        <View className="flex-row flex-wrap justify-between">
          {prayers.map((prayer) => (
            <Animated.View
              key={prayer.title}
              style={{
                opacity: fadeAnim,
                transform: [
                  {
                    translateY: fadeAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0],
                    }),
                  },
                ],
              }}
              className="w-[45%] mb-4"
            >
              <TouchableOpacity
                onPress={() => router.push(`/namaz-tariqa/${prayer.title}`)}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 items-center p-4"
              >
                <Image source={prayer.icon} className="w-12 h-12 mb-2" />
                <Text className="text-base font-medium  text-center">
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