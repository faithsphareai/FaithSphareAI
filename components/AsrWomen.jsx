import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { images } from '../constants';

export default function AsrWomen() {
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = new Animated.Value(1);

  const windowWidth = Dimensions.get('window').width;

  const asrSteps = [
    {
      title: "Preparation",
      description: "Prepare for Asr prayer with proper covering and intention",
      details: [
        "Ensure proper covering - loose clothes covering entire body except face and hands",
        "Make sure prayer area is clean",
        "Face the Qibla direction",
        "Make wudu if not already done",
        "Keep body movements gentle and controlled",
        "Ensure prayer time has begun"
      ],
      image: images.niyyah
    },
    {
      title: "First Rakat",
      description: "Begin the first Farz rakat of Asr",
      details: [
        "Make intention for 4 Farz rakats of Asr",
        "Raise hands below shoulders for Takbir",
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
      title: "Ruku and Sujood",
      description: "Complete the movements of first rakat",
      details: [
        "Bend for Ruku with back straight but not too low",
        "Keep arms close to sides in Ruku",
        "Say 'Subhana Rabbiyal Azeem' 3 times",
        "Rise saying 'Sami Allahu Liman Hamidah'",
        "For Sujood, go down keeping body compact",
        "Keep arms close to body in Sujood",
        "Say 'Subhana Rabbiyal Ala' 3 times in each Sujood"
      ],
      image: images.ruku
    },
    {
      title: "Second Rakat",
      description: "Complete the second rakat",
      details: [
        "Stand gracefully for second Rakat",
        "Recite Surah Al-Fatiha",
        "Recite another Surah",
        "Complete Ruku and Sujood as before",
        "Sit for Qaida-e-Oola (first sitting)",
        "Recite At-Tahiyyat",
        "Rise carefully for third Rakat"
      ],
      image: images.sajda
    },
    {
      title: "Third and Fourth Rakat",
      description: "Complete the remaining rakats",
      details: [
        "In third and fourth rakats:",
        "Recite only Surah Al-Fatiha",
        "Complete Ruku and Sujood maintaining modest posture",
        "Keep all movements gentle and controlled",
        "Maintain proper covering throughout",
        "Keep limbs close to body in all positions"
      ],
      image: images.qiyam
    },
    {
      title: "Final Sitting and Salam",
      description: "Complete the prayer with final sitting",
      details: [
        "Sit in final Qaida keeping feet to right side",
        "Recite At-Tahiyyat",
        "Recite Durood Ibrahim",
        "Recite the closing duas",
        "Turn face to right saying 'Assalam-o-Alaikum'",
        "Turn face to left saying 'Assalam-o-Alaikum'",
        "Make any personal duas"
      ],
      image: images.tashahhud
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
          <Ionicons name="chevron-back" size={24} color="pink" />
        </TouchableOpacity>
        
        <Text className="text-lg font-semibold text-pink-800">
          Step {currentStep + 1} of {asrSteps.length}
        </Text>
        
        <TouchableOpacity 
          onPress={handleNext}
          disabled={currentStep === asrSteps.length - 1}
          className={`p-2 ${currentStep === asrSteps.length - 1 ? 'opacity-50' : ''}`}
        >
          <Ionicons name="chevron-forward" size={24} color="pink" />
        </TouchableOpacity>
      </View>

      {/* Step Content */}
      <ScrollView className="flex-1 px-4">
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text className="text-xl font-bold text-pink-800 mb-2">
            {asrSteps[currentStep].title}
          </Text>
          
          <Image 
            source={asrSteps[currentStep].image}
            style={{ width: windowWidth - 32, height: 200 }}
            className="rounded-xl mb-4"
            resizeMode="cover"
          />
          
          <View className="bg-pink-50 rounded-lg p-4 mb-4">
            <Text className="text-lg text-pink-800">
              {asrSteps[currentStep].description}
            </Text>
          </View>

          <View className="space-y-2 mb-6">
            {asrSteps[currentStep].details.map((detail, index) => (
              <View key={index} className="flex-row items-center">
                <View className="w-2 h-2 rounded-full bg-pink-500 mr-2" />
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
              index === currentStep ? 'bg-pink-500' : 'bg-gray-300'
            }`}
          />
        ))}
      </View>
    </View>
  );
}