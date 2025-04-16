import { View, FlatList, Text, StyleSheet, Dimensions } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import React from 'react';

const { width } = Dimensions.get('window');
const numColumns = 3; // Grid columns

interface Post {
  id: string;
  media_url: string;
}

export default function ProfilePagePosts({ posts }: { posts: Array<Post> }) {
  console.log('Posts received:', posts); // Debugging logs

  if (!posts || posts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text>No videos posted yet</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      renderItem={({ item }) => (
        <View style={styles.postContainer}>
          <Video
            source={{ uri: item.media_url }}
            style={styles.video}
            resizeMode={ResizeMode.CONTAIN}
            useNativeControls={false}
            isLooping
            shouldPlay={false}
          />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  postContainer: {
    width: width / numColumns - 2,
    height: width / numColumns - 2,
    margin: 1,
    backgroundColor: 'black',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
