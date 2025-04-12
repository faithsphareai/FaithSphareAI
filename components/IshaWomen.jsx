import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { images } from '../constants';

export default function IshaWomen() {
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = new Animated.Value(1);
  const windowWidth = Dimensions.get('window').width;

  const ishaSteps = [
    {
      title: "Initial Sunnah",
      description: "Begin with 4 Sunnah rakats (two sets of 2)",
      details: [
        "Make Niyyah for first 2 Sunnah rakats",
        "Raise hands to shoulders saying Takbir",
        "Place hands on chest, right over left",
        "Keep feet close together",
        "Recite Thana quietly",
        "Complete first set of 2 rakats",
        "Repeat for second set",
        "Maintain modest positioning throughout"
      ],
      image: images.niyyah
    },
    {
      title: "Farz First Two Rakats",
      description: "Begin 4 Farz rakats of Isha",
      details: [
        "Make new Niyyah for Isha Farz",
        "Keep movements gentle and controlled",
        "Recite Al-Fatiha and another Surah in both rakats",
        "Maintain proper covering throughout",
        "Keep arms close to sides in Ruku",
        "Perform Sujood with compact positioning",
        "Sit for first Qaida after second rakat"
      ],
      image: images.qiyam
    },
    {
      title: "Farz Final Rakats",
      description: "Complete the remaining Farz rakats",
      details: [
        "Stand gracefully for third rakat",
        "Recite only Al-Fatiha in last two rakats",
        "Keep movements controlled and gentle",
        "Maintain modest positioning in Ruku and Sujood",
        "Sit for final Qaida",
        "Complete with Tashahhud, Durood, and Salam"
      ],
      image: images.ruku
    },
    {
      title: "Two Sunnah",
      description: "Perform 2 Sunnah rakats after Farz",
      details: [
        "Make Niyyah for 2 Sunnah rakats",
        "Keep movements gentle and controlled",
        "Recite Al-Fatiha and another Surah in each rakat",
        "Maintain compact positioning in all positions",
        "Complete with Tashahhud and Salam"
      ],
      image: images.sajda
    },
    {
      title: "Witr Prayer",
      description: "Complete 3 Witr rakats",
      details: [
        "Make Niyyah for 3 Witr rakats",
        "First two rakats like regular prayer",
        "In third rakat after Surah, say Takbir",
        "Raise hands to shoulders for Takbir",
        "Recite Dua Qunoot",
        "Complete with Ruku and Sujood",
        "Finish with Tashahhud and Salam"
      ],
      image: images.tashahhud
    },
    {
      title: "Final Duas",
      description: "Complete prayer with recommended duas",
      details: [
        "Remain seated in prayer position",
        "Recite Astaghfirullah 3 times",
        "Recite Ayat-ul-Kursi",
        "Perform Tasbih-e-Fatima",
        "Make personal duas",
        "Maintain composed posture throughout",
        "Complete with any night (Isha) specific duas"
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

      <View className="flex-row justify-center items-center p-4 space-x-2">
        {ishaSteps.map((_, index) => (
          <View
            key={index}
            className={`h-2 w-2 rounded-full ${
              index === currentStep ? 'bg-green-600' : 'bg-green-200'
            }`}
          />
        ))}
      </View>
    </View>
  );
}