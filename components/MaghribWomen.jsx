import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { images } from '../constants';

export default function MaghribWomen() {
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = new Animated.Value(1);
  const windowWidth = Dimensions.get('window').width;

  const maghribSteps = [
    {
      title: "Farz First Rakat",
      description: "Begin with 3 Farz rakats of Maghrib prayer",
      details: [
        "Make Niyyah for Maghrib Farz prayer",
        "Raise hands to shoulders (not above) saying Takbir",
        "Place hands on chest, right over left",
        "Keep feet close together, maintaining modest posture",
        "Recite Thana quietly",
        "Recite Ta'awwuz and Tasmiah",
        "Recite Surah Al-Fatiha",
        "Recite another Surah",
        "Perform Ruku keeping arms close to sides",
        "Keep movements controlled and gentle"
      ],
      image: images.niyyah
    },
    {
      title: "Farz Second Rakat",
      description: "Complete second Farz rakat",
      details: [
        "Rise gently for second Rakat",
        "Maintain proper covering throughout",
        "Recite Surah Al-Fatiha",
        "Recite another Surah",
        "Perform Ruku and Sujood with compact positioning",
        "In Sujood, keep arms close to body",
        "Sit for Qaida-e-Oola (first sitting)",
        "Recite At-Tahiyyat",
        "Rise carefully for third Rakat"
      ],
      image: images.ruku
    },
    {
      title: "Farz Third Rakat",
      description: "Complete the Farz prayer",
      details: [
        "Stand with composed posture",
        "Recite only Surah Al-Fatiha",
        "Keep movements gentle and controlled",
        "Complete Ruku and Sujood maintaining modesty",
        "Sit for final Qaida keeping feet to right side",
        "Recite At-Tahiyyat",
        "Recite Durood Ibrahim",
        "Complete with gentle Salam to both sides"
      ],
      image: images.sajda
    },
    {
      title: "Sunnah Rakats",
      description: "Perform 2 Sunnah rakats after Farz",
      details: [
        "Make Niyyah for 2 Sunnah rakats",
        "Maintain modest positioning throughout",
        "Keep movements gentle and controlled",
        "Recite Al-Fatiha and another Surah in each rakat",
        "Perform Ruku and Sujood with compact form",
        "Complete with Tashahhud and Salam",
        "Maintain composure throughout"
      ],
      image: images.qiyam
    },
    {
      title: "Nafl Prayer",
      description: "Optional 2 Nafl rakats",
      details: [
        "Make Niyyah for 2 Nafl rakats",
        "Can be performed at home",
        "Follow same procedure as Sunnah",
        "Maintain gentle, controlled movements",
        "Keep body compact in all positions",
        "Complete with Tashahhud and Salam",
        "Make personal duas while maintaining composure"
      ],
      image: images.tashahhud
    }
  ];

  const handleNext = () => {
    if (currentStep < maghribSteps.length - 1) {
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
          Step {currentStep + 1} of {maghribSteps.length}
        </Text>
        
        <TouchableOpacity 
          onPress={handleNext}
          disabled={currentStep === maghribSteps.length - 1}
          className={`p-2 ${currentStep === maghribSteps.length - 1 ? 'opacity-50' : ''}`}
        >
          <Ionicons name="chevron-forward" size={24} color="green" />
        </TouchableOpacity>
      </View>

      {/* Step Content */}
      <ScrollView className="flex-1 px-4">
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text className="text-xl font-bold text-green-800 mb-2">
            {maghribSteps[currentStep].title}
          </Text>
          
          <Image 
            source={maghribSteps[currentStep].image}
            style={{ width: windowWidth - 32, height: 200 }}
            className="rounded-xl mb-4"
            resizeMode="cover"
          />
          
          <View className="bg-green-50 rounded-lg p-4 mb-4">
            <Text className="text-lg text-green-800">
              {maghribSteps[currentStep].description}
            </Text>
          </View>

          <View className="space-y-2 mb-6">
            {maghribSteps[currentStep].details.map((detail, index) => (
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
        {maghribSteps.map((_, index) => (
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