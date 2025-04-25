import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import * as ImagePicker from 'expo-image-picker';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function UploadSelection({ onVideoSelect }: { onVideoSelect: (uri: string) => void }) {
  // Function to pick a video from the gallery
  const pickVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission required to access media library.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 0.1,
    });

    if (!result.canceled) {
      onVideoSelect(result.assets[0].uri); // Pass the selected video URI back to UploadVideo.tsx
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickVideo} style={styles.uploadIconContainer}>
        <MaterialIcons name="perm-media" size={50} color="black" />
        <View style={styles.addIcon}>
          <MaterialIcons name="add" size={18} color="white" />
        </View>
      </TouchableOpacity>
      <Text style={styles.text}>Select a video..</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -220,
  },
  uploadIconContainer: {
   
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  addIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#007AFF',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: -5,
    right: -15,
  },
  text: {
    marginTop: 5,
    fontSize: 14,
    color: '#777',
  },
});
