import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import React from 'react';
import { Video, ResizeMode } from 'expo-av';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

// Get screen dimensions for responsive sizing
const { width } = Dimensions.get('window');

export default function UploadSelected({ videoUri, onRemove }: { videoUri: string, onRemove: () => void }) {
  return (
    <View style={styles.container}>
      {/* Video Frame (Increased Size) */}
      <View style={styles.videoFrame}>
        <Video
          source={{ uri: videoUri }}
          style={styles.video}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN} // Keeps video inside the frame
        />

        {/* Remove Video Button (X Icon) */}
        <TouchableOpacity onPress={onRemove} style={styles.closeButton}>
          <MaterialIcons name="close" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  videoFrame: {
    width: width * 0.6, // 60% of screen width for a larger frame
    height: width * 1.0, // Maintain a 16:9 aspect ratio (height = width * (16/9) ≈ width * 1.777)
    backgroundColor: 'black', // Keeps a clean frame
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
    borderRadius: 15,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});