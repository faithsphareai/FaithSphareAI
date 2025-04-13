import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Audio } from "expo-av";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCompareDTW } from '../../../hooks/useCompareDTW';

const AudioBar = ({ audio, onPlay, onPause, isPlaying }) => (
  <Animatable.View
    animation="fadeInUp"
    duration={600}
    style={styles.audioBarContainer}
  >
    <Animatable.View
      animation={isPlaying ? "pulse" : undefined}
      iterationCount="infinite"
      duration={1000}
    >
      <MaterialIcons
        name="audiotrack"
        size={24}
        color={isPlaying ? "#15803d" : "#166534"}
        style={{ marginRight: 10 }}
      />
    </Animatable.View>
    <Text
      numberOfLines={1}
      style={styles.audioTitle}
    >
      {audio.name || "Unnamed Audio"}
    </Text>
    {isPlaying ? (
      <Animatable.View animation="bounceIn" duration={300}>
        <TouchableOpacity
          onPress={onPause}
          style={styles.pauseButton}
        >
          <Ionicons name="pause" size={24} color="white" />
        </TouchableOpacity>
      </Animatable.View>
    ) : (
      <Animatable.View animation="bounceIn" duration={300}>
        <TouchableOpacity
          onPress={onPlay}
          style={styles.playButton}
        >
          <Ionicons name="play" size={24} color="white" />
        </TouchableOpacity>
      </Animatable.View>
    )}
  </Animatable.View>
);

export default function Recitation() {
  const [originalAudio, setOriginalAudio] = useState(null);
  const [userAudio, setUserAudio] = useState(null);
  const [sound, setSound] = useState();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentlyPlaying, setCurrentlyPlaying] = useState(null);
  const [isOriginalUpload, setIsOriginalUpload] = useState(false);
  const [isUserUpload, setIsUserUpload] = useState(false);
  const router = useRouter();
  const [recording, setRecording] = useState();
  const [isRecording, setIsRecording] = useState(false);
  const compareDTWMutation = useCompareDTW();

  const [originalRecording, setOriginalRecording] = useState();
  const [userRecording, setUserRecording] = useState();
  const [isOriginalRecording, setIsOriginalRecording] = useState(false);
  const [isUserRecording, setIsUserRecording] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const pickAudio = async (setter) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "audio/*",
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        // Format the file object correctly
        const file = {
          name: result.assets[0].name,
          uri:
            Platform.OS === "ios"
              ? result.assets[0].uri.replace("file://", "")
              : result.assets[0].uri,
        };
        setter(file);
        Alert.alert("Success", `Uploaded: ${file.name}`);
      }
    } catch (error) {
      console.error("Audio Upload Error:", error);
      Alert.alert("Error", "Failed to upload audio.");
    }
  };

  const playSound = async (audio) => {
    if (audio) {
      try {
        if (sound) {
          await sound.unloadAsync();
        }

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
        });

        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audio.uri },
          { shouldPlay: true },
          (status) => {
            if (status.error) {
              console.error(`Audio playback error: ${status.error}`);
              Alert.alert("Playback Error", "Failed to play audio file");
            }
          }
        );

        setSound(newSound);
        setIsPlaying(true);
        setCurrentlyPlaying(audio);

        newSound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            setIsPlaying(false);
            setCurrentlyPlaying(null);
          }
        });
      } catch (error) {
        console.error("Play Sound Error:", error);
        Alert.alert(
          "Error",
          "Failed to play audio. Please try uploading again."
        );
      }
    }
  };

  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
      setIsPlaying(false);
    }
  };

  const similaritySearch = async () => {
    if (!originalAudio || !userAudio) {
      Alert.alert(
        "Missing Audio",
        "Please upload or record both original and user audio files."
      );
      return;
    }

    try {
      const result = await compareDTWMutation.mutateAsync({
        originalAudio: {
          ...originalAudio,
          type: originalAudio.name.endsWith('.mp3') ? 'audio/mp3' : 'audio/ogg'
        },
        userAudio: {
          ...userAudio,
          type: userAudio.name.endsWith('.mp3') ? 'audio/mp3' : 'audio/ogg'
        }
      });

      // Check if result is valid and has the expected properties
      if (result && typeof result.similarity_score === 'number') {
        Alert.alert(
          "Similarity Results",
          `Score: ${result.similarity_score.toFixed(2)}%\n\nInterpretation: ${result.interpretation || "No interpretation available"}`
        );
      } else {
        throw new Error('Invalid response format from comparison service');
      }
    } catch (error) {
      console.error('Full error details:', error);
      
      Alert.alert(
        "Error",
        "An error occurred while comparing the audio files. Please try again later."
      );
    }
  };

  async function startRecording(isOriginal) {
    try {
      const audioPermission = await Audio.requestPermissionsAsync();
      if (!audioPermission.granted) {
        Alert.alert("Permission Required", "Please grant microphone access");
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        (status) => console.log("Recording status:", status),
        100
      );

      if (isOriginal) {
        setOriginalRecording(recording);
        setIsOriginalRecording(true);
      } else {
        setUserRecording(recording);
        setIsUserRecording(true);
      }
    } catch (err) {
      console.error("Recording error:", err);
      Alert.alert(
        "Error",
        "Failed to start recording. Please check microphone permissions."
      );
    }
  }

  async function stopRecording(isOriginal) {
    try {
      const currentRecording = isOriginal ? originalRecording : userRecording;
      if (!currentRecording) return;

      if (isOriginal) {
        setIsOriginalRecording(false);
      } else {
        setIsUserRecording(false);
      }

      await currentRecording.stopAndUnloadAsync();
      const uri = currentRecording.getURI();
      const fileName = `recording-${Date.now()}.m4a`;

      const audioFile = {
        name: fileName,
        uri: Platform.OS === "ios" ? uri.replace("file://", "") : uri,
      };

      if (isOriginal) {
        setOriginalAudio(audioFile);
        setIsOriginalUpload(true);
        setOriginalRecording(undefined);
      } else {
        setUserAudio(audioFile);
        setIsUserUpload(true);
        setUserRecording(undefined);
      }
    } catch (err) {
      Alert.alert("Error", "Failed to stop recording");
    }
  }

  const recordAudio = async (isOriginal) => {
    if (isOriginal) {
      if (isOriginalRecording) {
        await stopRecording(true);
      } else {
        await startRecording(true);
      }
    } else {
      if (isUserRecording) {
        await stopRecording(false);
      } else {
        await startRecording(false);
      }
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#15803d" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Recitation
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Original Audio</Text>
        <View style={styles.optionsRow}>
          {!isOriginalUpload && (
            <TouchableOpacity
              onPress={() => {
                pickAudio(setOriginalAudio);
                setIsOriginalUpload(true);
              }}
              style={styles.uploadButton}
            >
              <MaterialIcons name="upload-file" size={24} color="#16a34a" />
              <Text style={styles.buttonText}>Upload</Text>
            </TouchableOpacity>
          )}

          {!originalAudio && !isOriginalUpload && (
            <Animatable.View
              animation={isOriginalRecording ? "pulse" : undefined}
              iterationCount="infinite"
              style={styles.flexOne}
            >
              <TouchableOpacity
                onPress={() => recordAudio(true)}
                style={isOriginalRecording ? styles.recordingButton : styles.recordButton}
              >
                <Ionicons
                  name={isOriginalRecording ? "stop" : "mic"}
                  size={24}
                  color={isOriginalRecording ? "#ef4444" : "#16a34a"}
                />
                <Text
                  style={isOriginalRecording ? styles.recordingText : styles.buttonText}
                >
                  {isOriginalRecording ? "Recording..." : "Record"}
                </Text>
              </TouchableOpacity>
            </Animatable.View>
          )}
        </View>

        {originalAudio && (
          <AudioBar
            audio={originalAudio}
            onPlay={() => playSound(originalAudio)}
            onPause={pauseSound}
            isPlaying={isPlaying && currentlyPlaying === originalAudio}
          />
        )}

        <Text style={styles.sectionTitleSecond}>User Audio</Text>
        <View style={styles.optionsRow}>
          {!isUserUpload && (
            <TouchableOpacity
              onPress={() => {
                pickAudio(setUserAudio);
                setIsUserUpload(true);
              }}
              style={styles.uploadButton}
            >
              <MaterialIcons name="upload-file" size={24} color="#16a34a" />
              <Text style={styles.buttonText}>Upload</Text>
            </TouchableOpacity>
          )}

          {!userAudio && !isUserUpload && (
            <Animatable.View
              animation={isUserRecording ? "pulse" : undefined}
              iterationCount="infinite"
              style={styles.flexOne}
            >
              <TouchableOpacity
                onPress={() => recordAudio(false)}
                style={isUserRecording ? styles.recordingButton : styles.recordButton}
              >
                <Ionicons
                  name={isUserRecording ? "stop" : "mic"}
                  size={24}
                  color={isUserRecording ? "#ef4444" : "#16a34a"}
                />
                <Text
                  style={isUserRecording ? styles.recordingText : styles.buttonText}
                >
                  {isUserRecording ? "Recording..." : "Record"}
                </Text>
              </TouchableOpacity>
            </Animatable.View>
          )}
        </View>

        {userAudio && (
          <AudioBar
            audio={userAudio}
            onPlay={() => playSound(userAudio)}
            onPause={pauseSound}
            isPlaying={isPlaying && currentlyPlaying === userAudio}
          />
        )}

        <TouchableOpacity
          onPress={similaritySearch}
          disabled={compareDTWMutation.isPending || !originalAudio || !userAudio}
          style={[
            styles.compareButton,
            (!originalAudio || !userAudio) && styles.disabledButton
          ]}
        >
          {compareDTWMutation.isPending ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color="#16a34a" />
              <Text style={styles.buttonText}>Comparing...</Text>
            </View>
          ) : (
            <View style={styles.buttonContentRow}>
              <MaterialIcons name="search" size={20} color="#16a34a" />
              <Text style={styles.buttonText}>Compare Audio</Text>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0fdf4', // green-50
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    backgroundColor: '#f0fdf4', // green-50
    borderColor: '#e5e7eb', // gray-200
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    color: '#166534', // green-800
    fontWeight: '600',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 24,
  },
  scrollContent: {
    padding: 20,
    height: '100%',
    backgroundColor: 'white',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  sectionTitleSecond: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  uploadButton: {
    borderWidth: 2,
    borderColor: '#f5f5f5', // gray-100
    paddingVertical: 16,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  recordButton: {
    borderWidth: 2,
    borderColor: '#f5f5f5', // gray-100
    paddingVertical: 16,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recordingButton: {
    borderWidth: 2,
    borderColor: '#fecaca', // red-200
    paddingVertical: 16,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    marginTop: 8,
  },
  recordingText: {
    fontSize: 18,
    marginTop: 8,
    color: '#ef4444', // red-500
  },
  audioBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4', // green-50
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#dcfce7', // green-100
  },
  audioTitle: {
    flex: 1,
    marginRight: 8,
    fontSize: 18,
    fontWeight: '500',
    color: '#166534', // green-800
  },
  playButton: {
    backgroundColor: '#16a34a', // green-600
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseButton: {
    backgroundColor: '#ef4444', // red-500
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compareButton: {
    borderWidth: 2,
    borderColor: '#f5f5f5', // gray-100
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  disabledButton: {
    opacity: 0.5,
  },
  flexOne: {
    flex: 1,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});