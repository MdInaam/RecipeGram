import { View, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import UploadSelection from './UploadSelection';
import UploadSelected from './UploadSelected';
import UploadCaption from './UploadCaption';


export default function UploadVideo() {
  // State to track selected video URI
  const [videoUri, setVideoUri] = useState<string | null>(null);

  return (
    <View style={styles.container}>
      {/* Part A: Show either UploadSelection or UploadSelected */}
      {videoUri ? (
        <UploadSelected videoUri={videoUri} onRemove={() => setVideoUri(null)} />
      ) : (
        <UploadSelection onVideoSelect={setVideoUri} />
      )}

      {/* Part B: Always show caption & upload section */}
      <UploadCaption videoUri={videoUri} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    padding: 20,
    justifyContent: 'center',
  },
});