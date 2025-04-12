import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams } from 'expo-router';

// Import all prayer components
import Fajr from '../../../../components/Fajr';
import FajrWomen from '../../../../components/FajrWomen';
import Zuhr from '../../../../components/Zuhr';
import DhuhrWomen from '../../../../components/DhuhrWomen';
import Asar from '../../../../components/Asar';
import AsrWomen from '../../../../components/AsrWomen';
import Maghrib from '../../../../components/Maghrib';
import MaghribWomen from '../../../../components/MaghribWomen';
import Isha from '../../../../components/Isha';
import IshaWomen from '../../../../components/IshaWomen';

export default function PrayerScreen() {
  const { prayer } = useLocalSearchParams();
  const [gender, setGender] = useState('male');

  const renderPrayerComponent = () => {
    switch (prayer) {
      case 'Fajr':
        return gender === 'male' ? <Fajr /> : <FajrWomen />;
      case 'Dhuhr':
        return gender === 'male' ? <Zuhr /> : <DhuhrWomen />;
      case 'Asr':
        return gender === 'male' ? <Asar /> : <AsrWomen />;
      case 'Maghrib':
        return gender === 'male' ? <Maghrib /> : <MaghribWomen />;
      case 'Isha':
        return gender === 'male' ? <Isha /> : <IshaWomen />;
      default:
        return <Text className="text-center text-lg mt-20">Prayer not found.</Text>;
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header with Gender Selection */}
      <View className="bg-green-50 pt-12 pb-4 px-4">
        <Text className="text-xl font-bold  text-green-800 text-center mb-4">
          {prayer} Prayer Guide
        </Text>
        <View className="bg-white rounded-lg overflow-hidden">
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
            className="h-12"
          >
            <Picker.Item label="Male Prayer Guide" value="male" />
            <Picker.Item label="Female Prayer Guide" value="female" />
          </Picker>
        </View>
      </View>

      {/* Prayer Component */}
      {renderPrayerComponent()}
    </View>
  );
}