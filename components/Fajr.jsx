import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { images } from '../constants';

export default function Fajr() {
  const [gender, setGender] = useState('male');
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = new Animated.Value(1);

  const windowWidth = Dimensions.get('window').width;

  const fajrSteps = [
    {
      title: "Sunnah First Rakat",
      description: "Make Niyyah (intention) for 2 Sunnah rakats of Fajr prayer",
      details: [
        "Face the Qibla",
        "Raise hands to ears",
        "Say 'Allahu Akbar'",
        "Place hands on chest (right over left)",
        "Recite Thana, Ta'awwuz, Tasmiah",
        "Recite Surah Al-Fatiha",
        "Recite any other Surah"
      ],
      image: images.niyyah
    },
    {
      title: "Complete First Rakat",
      description: "Perform Ruku and Sujood for first Rakat",
      details: [
        "Go into Ruku saying 'Allahu Akbar'",
        "Say 'Subhana Rabbiyal Azeem' 3 times",
        "Rise saying 'Sami Allahu Liman Hamidah'",
        "Perform first Sajdah saying 'Allahu Akbar'",
        "Say 'Subhana Rabbiyal Ala' 3 times",
        "Sit briefly between Sajdah",
        "Perform second Sajdah similarly"
      ],
      image: images.ruku
    },
    {
      title: "Sunnah Second Rakat",
      description: "Stand for second Rakat and complete prayer",
      details: [
        "Stand up for second Rakat",
        "Recite Bismillah and Surah Al-Fatiha",
        "Recite another Surah",
        "Perform Ruku and Sujood as before",
        "Sit for Tashahhud",
        "Recite At-Tahiyyat",
        "Complete with Salam"
      ],
      image: images.qiyam
    },
    {
      title: "Farz First Rakat",
      description: "Begin 2 Farz rakats of Fajr prayer",
      details: [
        "Make new Niyyah for Farz prayer",
        "Say Takbir-e-Tahreema",
        "Recite Thana, Ta'awwuz, Tasmiah",
        "Recite Surah Al-Fatiha",
        "Recite another Surah",
        "Complete Ruku and Sujood"
      ],
      image: images.takbeer
    },
    {
      title: "Farz Second Rakat",
      description: "Complete Farz prayer",
      details: [
        "Stand for second Rakat",
        "Recite Surah Al-Fatiha and another Surah",
        "Complete Ruku and Sujood",
        "Sit for final Tashahhud",
        "Recite Durood Ibrahim",
        "Recite closing duas",
        "Complete with Salam to both sides"
      ],
      image: images.tashahhud
    }
  ];

  const handleNext = () => {
    if (currentStep < fajrSteps.length - 1) {
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
          Step {currentStep + 1} of {fajrSteps.length}
        </Text>
        
        <TouchableOpacity 
          onPress={handleNext}
          disabled={currentStep === fajrSteps.length - 1}
          className={`p-2 ${currentStep === fajrSteps.length - 1 ? 'opacity-50' : ''}`}
        >
          <Ionicons name="chevron-forward" size={24} color="green" />
        </TouchableOpacity>
      </View>

      {/* Step Content */}
      <ScrollView className="flex-1 px-4">
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text className="text-xl font-bold text-green-800 mb-2">
            {fajrSteps[currentStep].title}
          </Text>
          
          <Image 
            source={fajrSteps[currentStep].image}
            style={{ width: windowWidth - 32, height: 200 }}
            className="rounded-xl mb-4"
            resizeMode="cover"
          />
          
          <View className="bg-green-50 rounded-lg p-4 mb-4">
            <Text className="text-lg text-green-800">
              {fajrSteps[currentStep].description}
            </Text>
          </View>

          <View className="space-y-2 mb-6">
            {fajrSteps[currentStep].details.map((detail, index) => (
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
        {fajrSteps.map((_, index) => (
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