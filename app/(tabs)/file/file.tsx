import React, { useState, useEffect } from "react";
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, 
  SafeAreaView, ActivityIndicator 
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import * as Progress from "react-native-progress";

export default function FilesScreen() {
  const [files, setFiles] = useState<{ name: string; mimeType: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    loadFiles();
  }, []);


  const loadFiles = async () => {
    try {
      const storedFiles = await AsyncStorage.getItem("files");
      if (storedFiles) {
        setFiles(JSON.parse(storedFiles));
      }
    } catch (error) {
      console.error("Error loading files:", error);
    }
  };


  async function pickFile() {
    try {
      const result = await DocumentPicker.getDocumentAsync();
      if (!result.canceled && result.assets.length > 0) {
        setUploading(true);
        setUploadProgress(0);

        const selectedFile = result.assets[0];
        const newFile = { 
          name: selectedFile.name, 
          mimeType: selectedFile.mimeType ?? "unknown" 
        };


        let progress = 0;
        const interval = setInterval(() => {
          progress += 0.1;
          if (progress >= 1) {
            clearInterval(interval);
            setUploadProgress(1);
            setTimeout(async () => {
              const newFiles = [...files, newFile];
              setFiles(newFiles);
              await AsyncStorage.setItem("files", JSON.stringify(newFiles));
              setUploading(false);
            }, 500);
          } else {
            setUploadProgress(progress);
          }
        }, 300);
      }
    } catch (error) {
      console.error("Error picking file:", error);
      setUploading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <Text style={styles.headerText}>Your Documents</Text>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Documents</Text>
        <TouchableOpacity onPress={pickFile} style={styles.addButton}>
          <AntDesign name="plus" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {uploading && (
        <View style={styles.uploadingContainer}>
          <Text style={styles.uploadingText}>Uploading...</Text>
          <Progress.Bar 
            progress={uploadProgress} 
            width={250} 
            color="#1E56A0" 
          />
        </View>
      )}
{files && files.length > 0 ? 
    <FlatList
    data={files}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item,index }) => (
      <View key={index} style={styles.documentItem}>
        <Feather name="file-text" size={30} color="#A19EB0" style={styles.icon} />
        <Text style={styles.documentText}>{item.name}</Text>
      </View>
    )}
  /> : 
  <View style={{alignItems:'center',marginTop:40}}>
    <Text style={{color:'red'}}>No Files Available</Text>
  </View>
 }
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
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
  documentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  icon: {
    marginRight: 15,
  },
  documentText: {
    fontSize: 18,
    color: "#4A4A4A",
  },
  addButton: {
    backgroundColor: "#1E56A0",
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadingContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  uploadingText: {
    fontSize: 16,
    color: "#1E56A0",
    marginBottom: 5,
  },
});
