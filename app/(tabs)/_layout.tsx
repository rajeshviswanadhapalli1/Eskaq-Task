import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native';

export default function TabLayout() {
  return (
    <SafeAreaView style={{flex:1}}>
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen 
        name="audio/audio" 
        options={{title:'Audio', tabBarIcon: ({ color }) => <Ionicons name="mic" size={24} color={color} /> }} 
      />
      <Tabs.Screen 
        name="file/file" 
        options={{title:'File', tabBarIcon: ({ color }) => <Ionicons name="folder" size={24} color={color} /> }} 
      />
    </Tabs>
    </SafeAreaView>
  );
}
