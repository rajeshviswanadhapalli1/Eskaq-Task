import { useEffect, useState } from "react";
import { View, Text, Button, FlatList, SafeAreaView,Image,
  StyleSheet,
  TouchableOpacity, } from "react-native";
import { Audio } from "expo-av";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const audioFiles = [
  { id: "1", name: "Audio1.mp3", duration: "13m 24s", size: "3.9mb" },
  { id: "2", name: "Audio2.mp3", duration: "0m 45s", size: "35kb" },
  { id: "3", name: "Audio3.mp3", duration: "10m 5s", size: "2.5mb" },
  { id: "4", name: "Audio4.mp3", duration: "16m 46s", size: "4.7mb" },
  { id: "5", name: "Audio5.mp3", duration: "00m 00s", size: "00mb" },
  { id: "6", name: "Audio6.mp3", duration: "24m 10s", size: "4.6mb" },
];
export default function AudioScreen() {
  const router = useRouter()
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordings, setRecordings] = useState<{ id: string; fileName: string; uri: string; duration: string; size: string }[]>([]);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [currentSound, setCurrentSound] = useState<Audio.Sound | null>(null);
const [isPlaying, setIsPlaying] = useState(false);
const [currentPlayingUri, setCurrentPlayingUri] = useState<string | null>(null);

 useEffect(() => {
  getRecordings();
 },[])
 const getRecordings = async() => {
  const storedRecordings = await AsyncStorage.getItem("recordings");
  let reco = storedRecordings ? JSON.parse(storedRecordings) : [];
  await setRecordings(reco)
 }

 async function playSound(uri: string) {
  try {
    // If the same sound is playing, pause it
    if (currentSound && currentPlayingUri === uri) {
      const status = await currentSound.getStatusAsync();
      if (status.isLoaded) {
        if (status.isPlaying) {
          await currentSound.pauseAsync();
          setIsPlaying(false);
        } else {
          await currentSound.playAsync();
          setIsPlaying(true);
        }
      }
      return;
    }

    // If a different sound is playing, stop and unload it
    if (currentSound) {
      await currentSound.stopAsync();
      await currentSound.unloadAsync();
      setCurrentSound(null);
      setIsPlaying(false);
    }

    // Create a new sound instance
    const { sound } = await Audio.Sound.createAsync({ uri });
    setCurrentSound(sound);
    setCurrentPlayingUri(uri);
    await sound.playAsync();
    setIsPlaying(true);

    // Handle playback completion
    sound.setOnPlaybackStatusUpdate(async (status) => {
      if (status.isLoaded && status.didJustFinish) {
        setIsPlaying(false);
        setCurrentPlayingUri(null);
        
        // Instead of unloading immediately, reset only when a new play request comes
        await sound.stopAsync();
      }
    });
  } catch (error) {
    console.error("Error playing sound:", error);
  }
}
console.log(recordings,'recording');

  return (
    <SafeAreaView style={{flex:1}}>
    
    <View style={styles.container}>
     <View style={{alignItems:'center',marginBottom:20}}>
     <Text style={styles.headerText}>Your library</Text>
     </View>
      <View style={styles.header}>
      <Text style={styles.title}>Audio Library</Text>
      <TouchableOpacity onPress={() => router.push("/audioRecord")} style={styles.addButton}>
        <AntDesign name="plus" size={24} color="white" />
      </TouchableOpacity>
        
      </View>

 {recordings && recordings.length > 0 ? 
 <View style={{marginTop:40}}>
      <FlatList
      data={recordings}
      keyExtractor={(item) => item.id}
      renderItem={({ item,index }) => (
        <View key={index} style={styles.audioItem}>
         
          <View style={styles.audioDetails}>
            <Text style={styles.audioName}>{item?.fileName}</Text>
            <Text style={styles.audioInfo}>
              {item.duration} - {item.size}
            </Text>
          </View>


          <TouchableOpacity onPress={() => playSound(item.uri)} style={styles.playButton}>
  {isPlaying && currentPlayingUri === item.uri ? (
    <AntDesign name="pause" size={20} color="#B0AFC2" />
  ) : (
    <AntDesign name="play" size={20} color="#B0AFC2" />
  )}
</TouchableOpacity>
        </View>
      )}
    /> 
    </View>
    : 
    <View style={{alignItems:'center',marginTop:40}}>
      <Text style={{color:'red'}}>No Recordings Available</Text>
    </View>
  }
      

    </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerText: {
    fontSize: 14,
    color: "#666",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  audioItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EDEDED",
  },
  audioIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#EDEDED",
    justifyContent: "center",
    alignItems: "center",
  },
  audioIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  audioDetails: {
    flex: 1,
    marginLeft: 15,
  },
  audioName: {
    fontSize: 16,
    fontWeight: "bold",
    color:'black'
  },
  audioInfo: {
    fontSize: 14,
    color: "#666",
  },
  playButton: {
    padding: 10,
  },
  addButton: {
    // position: "absolute",
    // right: 20,
    // bottom: 30,
    backgroundColor: "#1E56A0",
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    // shadowColor: "#000",
    // shadowOpacity: 0.2,
    // shadowOffset: { width: 2, height: 2 },
  },
});