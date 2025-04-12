import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { images } from '../constants';

export default function FajrWomen() {
  const [gender, setGender] = useState('female');
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = new Animated.Value(1);

  const windowWidth = Dimensions.get('window').width;

  const fajrSteps = [
    {
      title: "Preparation",
      description: "Prepare for Fajr prayer with proper clothing and intention",
      details: [
        "Ensure proper covering - loose clothes covering entire body except face and hands",
        "Use prayer mat (if available)",
        "Ensure quiet, clean place for prayer",
        "Face the Qibla direction",
        "Check that prayer time has begun",
        "Make wudu if not already done"
      ],
      image: images.preparation
    },
    {
      title: "Sunnah First Rakat",
      description: "Begin with 2 Sunnah rakats before Farz",
      details: [
        "Make Niyyah for 2 Sunnah rakats",
        "Raise hands to shoulders (not above) saying Takbir",
        "Place right hand over left below chest",
        "Keep feet close together",
        "Recite Thana quietly",
        "Recite Ta'awwuz and Tasmiah",
        "Recite Surah Al-Fatiha",
        "Recite another Surah"
      ],
      image: images.qiyam
    },
    {
      title: "Sunnah Ruku and Sujood",
      description: "Complete first Sunnah rakat",
      details: [
        "For Ruku, bend with back straight but not too low",
        "Keep arms close to sides",
        "Place hands on knees with fingers together",
        "Say 'Subhana Rabbiyal Azeem' 3 times",
        "Rise saying 'Sami Allahu Liman Hamidah'",
        "For Sujood, go down keeping body close together",
        "Place forehead, nose, palms, knees, and toes on ground",
        "Keep arms close to sides and flat on ground",
        "Say 'Subhana Rabbiyal Ala' 3 times"
      ],
      image: images.ruku_women
    },
    {
      title: "Sunnah Second Rakat",
      description: "Complete Sunnah prayer",
      details: [
        "Stand for second Rakat",
        "Recite Bismillah",
        "Recite Surah Al-Fatiha",
        "Recite another Surah",
        "Complete Ruku and Sujood as before",
        "Sit for final Qaida",
        "Keep right foot upright, left foot resting",
        "Place hands on thighs with fingers together",
        "Recite At-Tahiyyat, Durood Ibrahim, and duas",
        "Complete with Salam to both sides"
      ],
      image: images.tashahhud_women
    },
    {
      title: "Farz First Rakat",
      description: "Begin 2 Farz rakats of Fajr prayer",
      details: [
        "Make Niyyah for Fajr Farz prayer",
        "Raise hands to shoulders saying Takbir",
        "Position hands and feet as in Sunnah",
        "Recite Thana",
        "Recite Ta'awwuz and Tasmiah",
        "Recite Surah Al-Fatiha",
        "Recite another Surah",
        "Complete Ruku and Sujood as before"
      ],
      image: images.qiyam
    },
    {
      title: "Farz Second Rakat",
      description: "Complete the Farz prayer",
      details: [
        "Stand for second Rakat",
        "Recite Surah Al-Fatiha",
        "Recite another Surah",
        "Complete Ruku and Sujood",
        "Sit for final Qaida",
        "Maintain compact sitting position",
        "Recite At-Tahiyyat",
        "Recite Durood Ibrahim",
        "Recite closing duas",
        "Complete with Salam to both sides"
      ],
      image: images.tashahhud_women
    },
    {
      title: "Post-Prayer Duas",
      description: "Complete prayer with recommended duas",
      details: [
        "Remain seated in prayer position",
        "Recite Astaghfirullah 3 times",
        "Recite Ayat-ul-Kursi",
        "Perform Tasbih-e-Fatima:",
        "- SubhanAllah 33 times",
        "- Alhamdulillah 33 times",
        "- Allahu Akbar 34 times",
        "Make personal duas",
        "Recite morning (Fajr) specific duas"
      ],
      image: images.dua
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
          <Ionicons name="chevron-back" size={24} color="purple" />
        </TouchableOpacity>
        
        <Text className="text-lg font-semibold text-purple-800">
          Step {currentStep + 1} of {fajrSteps.length}
        </Text>
        
        <TouchableOpacity 
          onPress={handleNext}
          disabled={currentStep === fajrSteps.length - 1}
          className={`p-2 ${currentStep === fajrSteps.length - 1 ? 'opacity-50' : ''}`}
        >
          <Ionicons name="chevron-forward" size={24} color="purple" />
        </TouchableOpacity>
      </View>

      {/* Step Content */}
      <ScrollView className="flex-1 px-4">
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text className="text-xl font-bold text-purple-800 mb-2">
            {fajrSteps[currentStep].title}
          </Text>
          
          <Image 
            source={fajrSteps[currentStep].image}
            style={{ width: windowWidth - 32, height: 200 }}
            className="rounded-xl mb-4"
            resizeMode="cover"
          />
          
          <View className="bg-purple-50 rounded-lg p-4 mb-4">
            <Text className="text-lg text-purple-800">
              {fajrSteps[currentStep].description}
            </Text>
          </View>

          <View className="space-y-2 mb-6">
            {fajrSteps[currentStep].details.map((detail, index) => (
              <View key={index} className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-purple-500 mr-2" />
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
              index === currentStep ? 'bg-purple-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </View>
    </View>
  );
}