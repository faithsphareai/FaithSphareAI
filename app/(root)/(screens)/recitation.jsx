import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Pressable,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { Audio } from "expo-av";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Animatable from "react-native-animatable";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

const AudioBar = ({ audio, onPlay, onPause, isPlaying }) => (
  <Animatable.View
    animation="fadeInUp"
    duration={600}
    className="flex-row items-center bg-green-50 rounded-lg p-3 mt-4 shadow-sm border border-green-100"
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
      className="flex-1 mr-2 text-lg font-medium text-green-800"
    >
      {audio.name || "Unnamed Audio"}
    </Text>
    {isPlaying ? (
      <Animatable.View animation="bounceIn" duration={300}>
        <TouchableOpacity
          onPress={onPause}
          className="bg-red-500 rounded-full w-10 h-10 justify-center items-center"
        >
          <Ionicons name="pause" size={24} color="white" />
        </TouchableOpacity>
      </Animatable.View>
    ) : (
      <Animatable.View animation="bounceIn" duration={300}>
        <TouchableOpacity
          onPress={onPlay}
          className="bg-green-600 rounded-full w-10 h-10 justify-center items-center"
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

  const similaritySearch = () => {
    Alert.alert(
      "Similarity Search",
      "Similarity search functionality will be integrated here."
    );
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
    <SafeAreaView className="flex-1 bg-green-50">
      <View className="flex-row items-center px-4  py-4 border-b bg-green-50 border-gray-200">
        <TouchableOpacity onPress={handleBack}>
        <Ionicons name="arrow-back" size={24} color="#15803d" />
        </TouchableOpacity>
        <Text className="flex-1 text-lg text-green-800 font-semibold text-center">
          Recitation
        </Text>
        <View className="w-6" />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20 ,height:'100%', backgroundColor:'white'}}
        showsVerticalScrollIndicator={false}
      >
        <Text className="text-lg font-bold  mt-4">Original Audio</Text>
        <View className="flex-row justify-between mt-4">
          {!isOriginalUpload && (
            <TouchableOpacity
              onPress={() => {
                pickAudio(setOriginalAudio);
                setIsOriginalUpload(true);
              }}
              className="border-2 border-gray-100  py-4 rounded-lg flex-1 items-center justify-center mr-2 "
            >
              <MaterialIcons name="upload-file" size={24} color="#16a34a" />
              <Text className=" text-lg mt-2">Upload</Text>
            </TouchableOpacity>
          )}

          {!originalAudio && !isOriginalUpload && (
            <Animatable.View
              animation={isOriginalRecording ? "pulse" : undefined}
              iterationCount="infinite"
              className="flex-1"
            >
              <TouchableOpacity
                onPress={() => recordAudio(true)}
                className={`border-2 ${
                  isOriginalRecording ? "border-red-200" : "border-gray-100"
                } py-4 rounded-lg flex-1 items-center justify-center `}
              >
                <Ionicons
                  name={isOriginalRecording ? "stop" : "mic"}
                  size={24}
                  color={isOriginalRecording ? "#ef4444" : "#16a34a"}
                />
                <Text
                  className={`text-lg mt-2 ${
                    isOriginalRecording ? "text-red-200" : "text-black"
                  }`}
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

        <Text className="text-lg font-bold  mt-6">User Audio</Text>
        <View className="flex-row justify-between mt-4">
          {!isUserUpload && (
            <TouchableOpacity
              onPress={() => {
                pickAudio(setUserAudio);
                setIsUserUpload(true);
              }}
              className="border-2 border-gray-100 py-4 rounded-lg flex-1 items-center justify-center mr-2 "
            >
              <MaterialIcons name="upload-file" size={24} color="#16a34a" />
              <Text className=" text-lg mt-2">Upload</Text>
            </TouchableOpacity>
          )}

          {!userAudio && !isUserUpload && (
            <Animatable.View
              animation={isUserRecording ? "pulse" : undefined}
              iterationCount="infinite"
              className="flex-1"
            >
              <TouchableOpacity
                onPress={() => recordAudio(false)}
                className={`border-2 ${
                  isUserRecording ? "border-red-200" : "border-gray-100"
                } py-4 rounded-lg flex-1 items-center justify-center `}
              >
                <Ionicons
                  name={isUserRecording ? "stop" : "mic"}
                  size={24}
                  color={isUserRecording ? "#ef4444" : "#16a34a"}
                />
                <Text
                  className={`text-lg mt-2 ${
                    isUserRecording ? "text-red-500" : "text-black"
                  }`}
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
          className="border-2 border-gray-100 py-4 rounded-lg items-center mt-6 "
        >
          <Text className=" text-lg">
            <MaterialIcons name="search" size={20} color="#16a34a" /> Similarity
            Search
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
