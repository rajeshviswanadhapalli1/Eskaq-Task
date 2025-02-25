import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/splash4.png")} style={styles.logo} />
      <Text style={styles.title}>Welcome to EKSAQ</Text>
      <TouchableOpacity onPress={() => router.replace("/(tabs)/audio/audio")} style={styles.button}>
          <Ionicons name="arrow-forward" size={24} color="black" />
        </TouchableOpacity>
      {/* <TouchableOpacity style={styles.button} onPress={() => router.replace("/(tabs)/audio")}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
   justifyContent: "center",
   alignItems: "center" 
  },
  title: { 
    fontSize: 24, 
    // fontWeight: "bold" 
  },
  button: { 
    marginTop: 20, 
    padding: 10, 
    // backgroundColor: "blue", 
    borderRadius: 5 
  },
  buttonText: { 
    color: "white", 
    fontSize: 18 
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: "contain",
  },
});
