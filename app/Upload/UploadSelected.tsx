import { View, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { Video, ResizeMode } from 'expo-av';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function UploadSelected({ videoUri, onRemove }: { videoUri: string, onRemove: () => void }) {
  return (
    <View style={styles.container}>
      {/* Video Frame (Fixed Size) */}
      <View style={styles.videoFrame}>
        <Video
          source={{ uri: videoUri }}
          style={styles.video}
          useNativeControls
          resizeMode={ResizeMode.CONTAIN} // Keeps video inside the frame
        />

        {/* Remove Video Button (X Icon) */}
        <TouchableOpacity onPress={onRemove} style={styles.closeButton}>
          <MaterialIcons name="close" size={15} color="white" />
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
    width: 140, // Fixed width
    height: 250, // Fixed height for preview
    backgroundColor: 'black', // Keeps a clean frame
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
    
    overflow: 'hidden',
  },
  video: {
    width: '100%', // Full width of the frame
    height: '100%', // Full height of the frame
    borderRadius: 15,
    overflow: 'hidden',
  },
  closeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
