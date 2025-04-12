import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { images } from '../constants';

export default function Isha() {
  const [gender, setGender] = useState('male');
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = new Animated.Value(1);

  const windowWidth = Dimensions.get('window').width;

  const ishaSteps = [
    {
      title: "Farz First Rakat",
      description: "Begin with 4 Farz rakats of Isha prayer",
      details: [
        "Make Niyyah for Isha Farz prayer",
        "Say Takbir-e-Tahreema (Allahu Akbar)",
        "Recite Thana (Subhana-kallah-humma)",
        "Recite Ta'awwuz and Tasmiah",
        "Recite Surah Al-Fatiha",
        "Recite another Surah",
        "Perform Ruku saying 'Subhana Rabbiyal Azeem' 3 times",
        "Rise saying 'Sami Allahu Liman Hamidah'",
        "Perform two Sujood with 'Subhana Rabbiyal Ala'"
      ],
      image: images.niyyah
    },
    {
      title: "Farz Second Rakat",
      description: "Complete second Farz rakat",
      details: [
        "Stand for second Rakat",
        "Recite Bismillah",
        "Recite Surah Al-Fatiha",
        "Recite another Surah",
        "Complete Ruku and Sujood",
        "Sit for Qaida-e-Oola (first sitting)",
        "Recite At-Tahiyyat",
        "Stand for third Rakat"
      ],
      image: images.ruku
    },
    {
      title: "Farz Third Rakat",
      description: "Continue with third Farz rakat",
      details: [
        "Stand for third Rakat",
        "Recite only Surah Al-Fatiha",
        "Complete Ruku and Sujood",
        "Stand for fourth Rakat",
        "No sitting after third Rakat"
      ],
      image: images.sajda
    },
    {
      title: "Farz Fourth Rakat",
      description: "Complete the Farz prayer",
      details: [
        "Recite only Surah Al-Fatiha",
        "Complete Ruku and Sujood",
        "Sit for final Qaida (Qaida-e-Akhira)",
        "Recite At-Tahiyyat",
        "Recite Durood Ibrahim",
        "Recite closing duas",
        "Complete with Salam to both sides"
      ],
      image: images.tashahhud
    },
    {
      title: "Sunnah First Set",
      description: "Begin 2 Sunnah rakats after Farz",
      details: [
        "Make Niyyah for 2 Sunnah rakats",
        "Say Takbir-e-Tahreema",
        "Recite Thana",
        "Recite Ta'awwuz and Tasmiah",
        "Recite Surah Al-Fatiha",
        "Recite another Surah",
        "Complete two rakats as normal",
        "End with Salam"
      ],
      image: images.qiyam
    },
    {
      title: "Witr First Rakat",
      description: "Begin 3 Witr rakats (Wajib)",
      details: [
        "Make Niyyah for 3 Witr rakats",
        "Say Takbir-e-Tahreema",
        "Recite Thana",
        "Recite Ta'awwuz and Tasmiah",
        "Recite Surah Al-Fatiha",
        "Recite another Surah",
        "Complete Ruku and Sujood"
      ],
      image: images.qiyam
    },
    {
      title: "Witr Second Rakat",
      description: "Continue Witr prayer",
      details: [
        "Stand for second Rakat",
        "Recite Surah Al-Fatiha",
        "Recite another Surah",
        "Complete Ruku and Sujood",
        "Sit for Qaida-e-Oola",
        "Recite At-Tahiyyat",
        "Stand for third Rakat"
      ],
      image: images.ruku
    },
    {
      title: "Witr Third Rakat",
      description: "Complete Witr prayer",
      details: [
        "Recite Surah Al-Fatiha",
        "Recite another Surah",
        "Say Takbir and raise hands",
        "Recite Dua-e-Qunoot",
        "Complete Ruku and Sujood",
        "Sit for final Qaida",
        "Complete with Salam"
      ],
      image: images.tashahhud
    },
    {
      title: "Additional Nafl",
      description: "Optional 2 Nafl rakats",
      details: [
        "Make Niyyah for 2 Nafl rakats",
        "Follow same procedure as Sunnah",
        "Can be prayed at home",
        "Recite preferred Surahs after Al-Fatiha",
        "Complete with Tashahhud and Salam"
      ],
      image: images.tasleem
    },
    {
      title: "Final Duas",
      description: "Complete prayer with recommended duas",
      details: [
        "Recite Astaghfirullah 3 times",
        "Recite Ayat-ul-Kursi",
        "Perform Tasbih-e-Fatima:",
        "- SubhanAllah 33 times",
        "- Alhamdulillah 33 times",
        "- Allahu Akbar 34 times",
        "Make personal duas",
        "Recite night (Isha) specific duas"
      ],
      image: images.tasleem
    }
  ];

  const handleNext = () => {
    if (currentStep < ishaSteps.length - 1) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start();
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header with Gender Selection */}
     

      {/* Step Navigation */}
      <View className="flex-row justify-between items-center px-4 py-2">
        <TouchableOpacity 
          onPress={handlePrevious}
          disabled={currentStep === 0}
          className={`p-2 ${currentStep === 0 ? 'opacity-50' : ''}`}
        >
          <Ionicons name="chevron-back" size={24} color="green" />
        </TouchableOpacity>
        
        <Text className="text-lg font-semibold text-green-800">
          Step {currentStep + 1} of {ishaSteps.length}
        </Text>
        
        <TouchableOpacity 
          onPress={handleNext}
          disabled={currentStep === ishaSteps.length - 1}
          className={`p-2 ${currentStep === ishaSteps.length - 1 ? 'opacity-50' : ''}`}
        >
          <Ionicons name="chevron-forward" size={24} color="green" />
        </TouchableOpacity>
      </View>

      {/* Step Content */}
      <ScrollView className="flex-1 px-4">
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text className="text-xl font-bold text-green-800 mb-2">
            {ishaSteps[currentStep].title}
          </Text>
          
          <Image 
            source={ishaSteps[currentStep].image}
            style={{ width: windowWidth - 32, height: 200 }}
            className="rounded-xl mb-4"
            resizeMode="cover"
          />
          
          <View className="bg-green-50 rounded-lg p-4 mb-4">
            <Text className="text-lg text-green-800">
              {ishaSteps[currentStep].description}
            </Text>
          </View>

          <View className="space-y-2 mb-6">
            {ishaSteps[currentStep].details.map((detail, index) => (
              <View key={index} className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                <Text className="text-gray-700 text-base">{detail}</Text>
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

      {/* Progress Indicators */}
      <View className="flex-row justify-center items-center p-4 space-x-2">
        {ishaSteps.map((_, index) => (
          <View
            key={index}
            className={`h-2 w-2 rounded-full ${
              index === currentStep ? 'bg-green-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </View>
    </View>
  );
}