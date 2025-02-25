import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity,  Image, StyleSheet, Alert, TextInput } from "react-native";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";
import { useRouter } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRecording } from "../components/RecordingContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

export default function AudioPlayerScreen() {
    const { recording } = useRecording();
  const router = useRouter();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [editedFileName, setEditedFileName] = useState("");
console.log(recording?._uri,'audio generate');

  const audioFile = recording?._uri; // Replace with actual audio file
//   const fileName = "huwahgfuegubu48.mp3";
  const fileName = audioFile?.split('/').pop();
  useEffect(() => {
    setEditedFileName("NewRecording.m4a");
    loadAudio();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  async function loadAudio() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioFile as string },
        { shouldPlay: false }
      );
      setSound(sound);

      sound.setOnPlaybackStatusUpdate((status: any) => {
        if (status.isLoaded) {
          setPosition(status.positionMillis);
          setDuration(status.durationMillis);
          if (status.didJustFinish) {
            setIsPlaying(false);
          }
        }
      });
    } catch (error) {
      console.log("Error loading audio", error);
    }
  }

  async function togglePlayPause() {
    if (sound) {
      const status = await sound.getStatusAsync();
  
      if (status.isLoaded) {
        if (isPlaying) {
          await sound.pauseAsync();
        } else {
          if (status.positionMillis >= (status.durationMillis ?? 0)) {
            // Restart audio from beginning if it's finished
            await sound.setPositionAsync(0);
          }
          await sound.playAsync();
        }
        setIsPlaying(!isPlaying);
      }
    }
  }
  async function seekAudio(value: number) {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  }
 
  function formatDuration(millis: number) {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds}s`;
  }
  async function getFileSize(uri: string) {
    try {
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (fileInfo.exists) {
        const sizeInBytes = fileInfo.size || 0;
        const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2) + " MB"; // Convert to MB
        return sizeInMB;
      }
    } catch (error) {
      console.log("Error getting file size:", error);
    }
    return "Unknown";
  }
  async function saveRecording() {
    if (!audioFile || !editedFileName) {
      Alert.alert("Error", "No audio file or filename is empty.");
      return;
    }
    const size = await getFileSize(audioFile)
const dur = formatDuration(duration)
    const recordingData = {
      uri: audioFile,
      fileName: editedFileName,
      duration: dur,
      size:size
    };

    try {

      const storedRecordings = await AsyncStorage.getItem("recordings");
      let recordings = storedRecordings ? JSON.parse(storedRecordings) : [];

      recordings.push(recordingData);
      console.log(recordings,':::: when saving record');
      

      await AsyncStorage.setItem("recordings", JSON.stringify(recordings));

      Alert.alert("Success", "Recording saved successfully!");
      router.push("/(tabs)/audio/audio");
    } catch (error) {
      console.log("Error saving recording:", error);
      Alert.alert("Error", "Failed to save recording.");
    }
  }
  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerText}>Audio</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <Image source={require("../assets/images/splash4.png")} style={styles.image} />

      <Text style={styles.title}>Audio Generated!</Text>

      <TextInput
        style={styles.fileNameInput}
        value={editedFileName}
        onChangeText={setEditedFileName}
        placeholder="Enter file name"
      />

      <View style={styles.progressContainer}>
        <Text style={styles.timeText}>{new Date(position).toISOString().substr(14, 5)}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          onSlidingComplete={seekAudio}
          minimumTrackTintColor="#4da6ff"
          maximumTrackTintColor="#E1E1E1"
          thumbTintColor="#4da6ff"
        />
        <Text style={styles.timeText}>{new Date(duration).toISOString().substr(14, 5)}</Text>
      </View>

      <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
        <Ionicons name={isPlaying ? "pause" : "play"} size={40} color="white" />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => saveRecording()} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save audio</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  header: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "600",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  fileName: {
    fontSize: 14,
    color: "#888",
    marginBottom: 20,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  timeText: {
    fontSize: 14,
    color: "#555",
  },
  slider: {
    flex: 1,
    marginHorizontal: 10,
  },
  playButton: {
    backgroundColor: "#4da6ff",
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#003399",
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 10,
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  fileNameInput: {
    fontSize: 14,
    color: "#555",
    // borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 20,
    padding: 5,
    width: "80%",
    textAlign: "center",
  },
});
