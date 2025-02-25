import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Dimensions } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Svg, { Rect } from 'react-native-svg';
import { useRecording } from "../components/RecordingContext";

export default function AudioRecorderScreen() {
  const { setRecord } = useRecording();
  const [isRecording, setIsRecording] = useState(false);
  const [recordTime, setRecordTime] = useState(0);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordings, setRecordings] = useState<{ uri: string }[]>([]);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const numberOfBars = 20
  const barWidth = 3;
    const barSpacing = 2;
    const waveformHeight = 30;
    const waveformColor = '#B0BEC5';
  let interval : any;
  const generateRandomHeights = () => {
    const heights = [];
    for (let i = 0; i < numberOfBars; i++) {
        heights.push(Math.floor(Math.random() * waveformHeight * 0.8) + waveformHeight * 0.2); // Ensure minimum height
    }
    return heights;
};
const barHeights = generateRandomHeights();
  useEffect(() => {
    
    if (isRecording) {
      interval = setInterval(() => {
        setRecordTime((prev) => prev + 1);
        // generateWaveform();
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') return alert('Permission needed');

      await Audio.setAudioModeAsync({ allowsRecordingIOS: true });

      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );

      recordingRef.current = recording;
      setRecording(recording);
      setIsRecording(true);
      setRecordTime(0);
      setWaveformData(new Array(30).fill(5)); // Reset waveform data
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  };
// async function startRecording() {
//     try {
//       const { status } = await Audio.requestPermissionsAsync();
//       if (status !== "granted") {
//         console.log("Permission to access microphone denied");
//         return;
//       }

//       const newRecording = new Audio.Recording();
//       await newRecording.prepareToRecordAsync(
//         Audio.RecordingOptionsPresets.HIGH_QUALITY 
//       );
//       await newRecording.startAsync();
//       setRecording(newRecording);
//     } catch (error) {
//       console.error("Failed to start recording:", error);
//     }
//   }
  const stopRecording = async () => {
    if (recording) {
      await recording.stopAndUnloadAsync();
      setIsRecording(false);
      console.log(recording,'recording');
      // let audioUri = {}
      setRecord(recording)
      router.push({
        pathname: "./audioGenerate",
        // params: { audioUri : recording },
      });
      console.log('Recording saved:', recording.getURI());
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Your Library</Text>
      </View>

      <View style={styles.recorderContainer}>
        {isRecording ? (
          <View style={styles.recordingBox}>
            <Svg height={waveformHeight} width={numberOfBars * (barWidth + barSpacing)} >
                {barHeights.map((height, index) => (
                    <Rect
                        key={index}
                        x={index * (barWidth + barSpacing)}
                        y={waveformHeight - height}
                        width={barWidth}
                        height={height}
                        fill={waveformColor}
                        rx={1} // Optional: round the corners
                    />
                ))}
            </Svg>
          {/* Waveform Visualization */}
          {/* <View style={styles.waveformContainer}>
            {waveformData.map((height, index) => (
              <View key={index} style={[styles.waveformBar, { height }]} />
            ))}
          </View> */}
            <Text style={styles.timer}>{`00 : ${recordTime < 10 ? '0' : ''}${recordTime}`}</Text>
            <TouchableOpacity style={styles.doneButton} onPress={stopRecording}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </View>
        ) : (
         
          <TouchableOpacity style={styles.micButton} onPress={startRecording}>
            <Ionicons name="mic" size={50} color="white" />
          </TouchableOpacity>
    
        )}
      </View>

      {!isRecording && <Text style={styles.instruction}>Click on the button to start recording</Text>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // flexDirection:'column',
    // justifyContent:'space-between',
    backgroundColor: '#FAFAFA',
    alignItems: 'center',
    // height:Dimensions
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingVertical: 15,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 15,
    padding: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1C1C1E',
  },
  recorderContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  micButton: {
    width: 80,
    height: 80,
    backgroundColor: '#4CAF50',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingBox: {
    backgroundColor: 'white',
    width: 250,
    height: 140,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timer: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#757575',
    marginTop: 10,
  },
  doneButton: {
    backgroundColor: '#14213D',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginTop: 10,
  },
  doneText: {
    color: 'white',
    fontWeight: 'bold',
  },
  instruction: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
});
