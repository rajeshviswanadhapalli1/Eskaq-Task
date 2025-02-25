import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import { useRouter } from "expo-router";

SplashScreen.preventAutoHideAsync(); 

export default function SplashScreenComponent() {
  const router = useRouter();
  useEffect(() => {
    setTimeout(async () => {
      console.log('splash screen');
      
      await SplashScreen.hideAsync();
      router.replace("/Welcome"); 
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/splash4.png")} style={styles.logo} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
});
