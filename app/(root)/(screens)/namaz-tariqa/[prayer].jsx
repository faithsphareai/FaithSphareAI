import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
        return <Text style={styles.notFoundText}>Prayer not found.</Text>;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          {prayer} Prayer Guide
        </Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={gender}
            onValueChange={(itemValue) => setGender(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Male Prayer Guide" value="male" />
            <Picker.Item label="Female Prayer Guide" value="female" />
          </Picker>
        </View>
      </View>

      {renderPrayerComponent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: '#f0fdf4',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#15803d',
    textAlign: 'center',
    marginBottom: 16,
  },
  pickerContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 48,
  },
  notFoundText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 80,
  },
});