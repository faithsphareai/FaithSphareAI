import React from 'react';
import { View, Text, ScrollView, Image, Dimensions, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native-gesture-handler';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../context/AuthContext';

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const screenWidth = Dimensions.get('window').width;
  const buttonSize = (screenWidth - 48) / 2;

  const buttons = [
    {
      title: 'Recitation',
      route: '/recitation',
      image: require('../../../assets/recitationVector.jpg'),
    },
    {
      title: 'OCR Scanner',
      route: '/ocr',
      image: require('../../../assets/quranAuthVector.jpg'), 
    },
    {
      title: 'Namaz Tariqa',
      route: '/namaz-tariqa',
      image: require('../../../assets/namazVector.jpg'),
    },
    {
      title: 'Quiz',
      route: { 
        pathname: '/chatbot',  
        params: { 
          chatContext: 'quiz',
          title: 'Islamic Quiz'
        }
      },
      image: require('../../../assets/quizVector.jpg'),
    },
    {
      title: 'Hadith Auth',
      route: { 
        pathname: '/chatbot',
        params: { 
          chatContext: 'hadith',
          title: 'Hadith Authentication'
        }
      },
      image: require('../../../assets/hadithAuthVector.jpg'),
    },
    {
      title: 'Quran Auth',
      route: { 
        pathname: '/chatbot',
        params: { 
          chatContext: 'quran',
          title: 'Quran Ayat Authentication'
        }
      },
      image: require('../../../assets/quranAuthVector.jpg'),
    },
  ];

  const handleButtonPress = (route) => {
    // Check if it's a protected route (chatbot or ocr)
    if (
      (typeof route === 'string' && route === '/ocr') || 
      (typeof route === 'object' && route.pathname === '/chatbot')
    ) {
      if (!user) {
        // Redirect to login if user is not authenticated
        router.push('/(auth)/sign-in');
        return;
      }
    }
    router.push(route);
  };

  const handleLogout = async () => {
    await logout();
    // No need to navigate away, the UI will update automatically
  };

  return (
    <SafeAreaView style={styles.container}>
    <Animatable.View animation="fadeIn" duration={1000}>
      <Image
        source={require('../../../assets/home.jpg')}
        style={{
          width: screenWidth,
          height: screenWidth * 0.6,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      />
    </Animatable.View>

    <View style={styles.headerContainer}>
      <Text style={styles.titleText}>FaithSphere</Text>
      <Text style={styles.subtitleText}>
        Your one-stop destination for spiritual growth and knowledge.
      </Text>
      
      <Text style={styles.subtitleText}>
        Welcome, {user ? user.name : 'Guest'} !
      </Text>
    </View>

    <ScrollView style={styles.scrollContainer}>
      <View style={styles.buttonGrid}>
        {buttons.map((button, index) => (
          <Animatable.View
            key={button.title}
            animation="fadeInUp"
            delay={index * 100}
            style={{
              width: buttonSize,
              height: buttonSize,
              marginBottom: 16,
            }}
          >
            <TouchableOpacity
              onPress={() => handleButtonPress(button.route)}
              style={[{
                width: '100%',
                height: '100%',
              }, styles.buttonContainer]}
            >
              <View style={[{ height: '70%' }, styles.imageContainer]}>
                <Image
                  source={button.image}
                  style={{
                    width: '80%',
                    height: '80%',
                  }}
                  resizeMode="contain"
                />
              </View>
              <View style={[{ height: '30%' }, styles.buttonTextContainer]}>
                <Text style={styles.buttonText}>
                  {button.title}
                </Text>
              </View>
            </TouchableOpacity>
          </Animatable.View>
        ))}

        {/* Auth Button */}
        <Animatable.View
          animation="fadeInUp"
          delay={buttons.length * 100}
          style={{
            width: buttonSize,
            height: buttonSize,
            marginBottom: 16,
          }}
        >
          <TouchableOpacity
            onPress={user ? handleLogout : () => router.push('/(auth)/sign-in')}
            style={[{
              width: '100%',
              height: '100%',
            }, styles.buttonContainer]}
          >
            <View style={[{ height: '70%' }, styles.imageContainer]}>
              <Image
                source={user 
                  ? require('../../../assets/logout.jpeg')
                  : require('../../../assets/login2.png')
                }
                style={{
                  width: '80%',
                  height: '80%',
                }}
                resizeMode="contain"
              />
            </View>
            <View style={[{ height: '30%' }, styles.buttonTextContainer]}>
              <Text style={styles.buttonText}>
                {user ? 'Logout' : 'Login'}
              </Text>
            </View>
          </TouchableOpacity>
        </Animatable.View>
      </View>
    </ScrollView>
  </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    paddingVertical: 16,
  },
  titleText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  subtitleText: {
    textAlign: 'center',
    fontSize: 14,
    color: 'black',
    marginTop: 8,
    marginHorizontal: 16,
  },
  scrollContainer: {
    paddingHorizontal: 16,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  buttonText: {
    textAlign: 'center',
    color: 'black',
    fontWeight: '500',
  },
});