import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { images } from '../constants';

export default function Asr() {
  const [gender, setGender] = useState('male');
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = new Animated.Value(1);

  const windowWidth = Dimensions.get('window').width;

  const asrSteps = [
    {
      title: "Initial Sunnah",
      description: "Begin with 4 Sunnah rakats of Asr",
      details: [
        "Make Niyyah for 4 Sunnah rakats",
        "Say Takbir-e-Tahreema (Allahu Akbar)",
        "Recite Thana",
        "Recite Ta'awwuz and Tasmiah",
        "Recite Surah Al-Fatiha",
        "Recite another Surah",
        "Complete Ruku and Sujood",
        "After 2 rakats, complete with Tashahhud and Salam",
        "Repeat the process for next 2 rakats"
      ],
      image: images.niyyah
    },
    {
      title: "Farz First Rakat",
      description: "Begin 4 Farz rakats of Asr prayer",
      details: [
        "Make new Niyyah for Asr Farz",
        "Say Takbir-e-Tahreema",
        "Recite Thana",
        "Recite Ta'awwuz and Tasmiah",
        "Recite Surah Al-Fatiha",
        "Recite another Surah",
        "Perform Ruku saying 'Subhana Rabbiyal Azeem' 3 times",
        "Stand saying 'Sami Allahu Liman Hamidah'",
        "Perform two Sujood with 'Subhana Rabbiyal Ala'"
      ],
      image: images.takbeer
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
        "Say Bismillah",
        "Recite only Surah Al-Fatiha",
        "Complete Ruku",
        "Perform both Sujood",
        "Stand for fourth Rakat"
      ],
      image: images.qiyam
    },
    {
      title: "Farz Fourth Rakat",
      description: "Complete the Farz prayer",
      details: [
        "Recite Bismillah",
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
      title: "Final Duas",
      description: "Complete the prayer with recommended duas",
      details: [
        "Recite Astaghfirullah 3 times",
        "Recite Ayat-ul-Kursi",
        "Perform Tasbih-e-Fatima",
        "- SubhanAllah 33 times",
        "- Alhamdulillah 33 times",
        "- Allahu Akbar 34 times",
        "Make personal duas"
      ],
      image: images.tasleem
    }
  ];

  const handleNext = () => {
    if (currentStep < asrSteps.length - 1) {
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
          Step {currentStep + 1} of {asrSteps.length}
        </Text>
        
        <TouchableOpacity 
          onPress={handleNext}
          disabled={currentStep === asrSteps.length - 1}
          className={`p-2 ${currentStep === asrSteps.length - 1 ? 'opacity-50' : ''}`}
        >
          <Ionicons name="chevron-forward" size={24} color="green" />
        </TouchableOpacity>
      </View>

      {/* Step Content */}
      <ScrollView className="flex-1 px-4">
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text className="text-xl font-bold text-green-800 mb-2">
            {asrSteps[currentStep].title}
          </Text>
          
          <Image 
            source={asrSteps[currentStep].image}
            style={{ width: windowWidth - 32, height: 200 }}
            className="rounded-xl mb-4"
            resizeMode="cover"
          />
          
          <View className="bg-green-50 rounded-lg p-4 mb-4">
            <Text className="text-lg text-green-800">
              {asrSteps[currentStep].description}
            </Text>
          </View>

          <View className="space-y-2 mb-6">
            {asrSteps[currentStep].details.map((detail, index) => (
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
        {asrSteps.map((_, index) => (
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