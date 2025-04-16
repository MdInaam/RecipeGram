import React, { useRef, useState, useEffect, useContext } from 'react';
import { View, FlatList, Dimensions, StyleSheet, TouchableWithoutFeedback, ViewToken, Text, TextInput } from 'react-native';
import { ResizeMode, Video } from 'expo-av';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import FooterPNC from './FooterPNC';
import OptionsLCA from './OptionsLCA';
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';
import CommentSection from './CommentSection';
import axios from 'axios';
import { AuthContext } from '@/context/AuthContext';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TouchableOpacity } from 'react-native';

const { height, width } = Dimensions.get('window');

interface ReelVideoProps {
  videos: Array<{
    post_id: string;
    media_url: string;
    profile_image: string;
    username: string;
    caption: string;
    recipe: string;
    likes: number;
    comments: number;
    userlike: boolean;
  }>;
}

type Comment = {
  id: number;
  user_id: number;
  post_id: string;
  text: string;
  created_at: string;
  parent_id?: number | null;
  username?: string;
  profile_image?: string;
  likes?: number;
  reply_count?: number;
  userlike?: boolean;
};

export default function ReelVideo({ videos }: ReelVideoProps) {
  const { user } = useContext(AuthContext);

  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef<Video[]>([]);
  const isFocused = useIsFocused();

  const [isPlaying, setIsPlaying] = useState(true);
  const fadeAnim = useSharedValue(0);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 80 });

  const commentSheetRef = useRef<BottomSheet>(null);
  const snapPoints = React.useMemo(() => ["70%"], []);
  const [comments, setComments] = useState<Comment[]>([]);
  const [currentPostId, setCurrentPostId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState<{ id: number; username: string } | null>(null);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const newIndex = viewableItems[0].index ?? 0;
      setCurrentIndex(newIndex);
      if (videos[newIndex]) {
        setCurrentPostId(videos[newIndex].post_id);
      }
      setComments([]);
      setNewComment("");
      setReplyTo(null);
    }
  });

  const fetchComments = async (post_id: string) => {
    try {
      console.log(`Fetching comments for post: ${post_id}`);
      setComments([]);
      const response = await axios.get(`${process.env.EXPO_PUBLIC_HOST_URL}/comments?post_id=${post_id}&user_id=${user?.id}`);
      if (post_id === currentPostId) {
        setComments(response.data);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
      setComments([]);
    }
  };

  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    try {
      await axios.post(`${process.env.EXPO_PUBLIC_HOST_URL}/comments`, {
        user_id: user?.id,
        post_id: currentPostId,
        text: newComment,
        parent_id: replyTo?.id ?? null,
      });
      setNewComment("");
      setReplyTo(null);
      await fetchComments(currentPostId!); // Refetch comments after posting
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const openComments = async () => {
    if (videos[currentIndex]?.post_id) {
      const postId = videos[currentIndex].post_id;
      setCurrentPostId(postId);
      await fetchComments(postId);
      commentSheetRef.current?.snapToIndex(0);
    }
  };

  useEffect(() => {
    if (videos[currentIndex]) {
      setCurrentPostId(videos[currentIndex].post_id);
    }
  }, [currentIndex, videos]);

  useEffect(() => {
    videoRefs.current.forEach(async (video, index) => {
      if (video) {
        if (index === currentIndex) {
          await video.playAsync();
        } else {
          await video.pauseAsync();
          await video.setPositionAsync(0);
        }
      }
    });
    fadeAnim.value = withTiming(0, { duration: 300 });
  }, [currentIndex, isFocused]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        videoRefs.current.forEach(async (video) => {
          if (video) {
            await video.pauseAsync();
            await video.setPositionAsync(0);
          }
        });
      };
    }, [])
  );

  const handlePlayPause = async (index: number) => {
    const video = videoRefs.current[index];
    if (video) {
      if (isPlaying) {
        await video.pauseAsync();
        setIsPlaying(false);
        fadeAnim.value = withTiming(1, { duration: 500 });
      } else {
        await video.playAsync();
        setIsPlaying(true);
        fadeAnim.value = withTiming(0, { duration: 500 });
      }
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FlatList
        data={videos}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableWithoutFeedback onPress={() => handlePlayPause(index)}>
            <View style={styles.videoContainer}>
              <Video
                ref={(ref) => (videoRefs.current[index] = ref!)}
                source={{ uri: item.media_url }}
                style={styles.video}
                resizeMode={ResizeMode.COVER}
                shouldPlay={index === currentIndex && isFocused}
                isLooping
                useNativeControls={false}
              />
              <Animated.View style={[styles.playButton, { opacity: fadeAnim }]}>
                <Ionicons name="play" size={50} color="white" />
              </Animated.View>
              <View style={styles.overlay}>
                <View style={styles.optionsContainer}>
                  <OptionsLCA
                    post_id={item.post_id}
                    likes={item.likes}
                    comments={item.comments}
                    userlike={item.userlike}
                    openComments={openComments}
                  />
                </View>
                <View style={styles.footerContainer}>
                  <FooterPNC
                    username={item.username}
                    profile_image={item.profile_image}
                    caption={item.caption}
                    recipe={item.recipe}
                  />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
        pagingEnabled
        snapToAlignment="center"
        decelerationRate={'fast'}
        showsVerticalScrollIndicator={false}
        viewabilityConfig={viewabilityConfig.current}
        onViewableItemsChanged={onViewableItemsChanged.current}
        style={styles.flatList}
      />

      <BottomSheet
        ref={commentSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        handleStyle={styles.bottomSheetHandle}
        backgroundStyle={styles.bottomSheetBackground}
        keyboardBehavior="interactive"
        enableOverDrag={false}
        enableContentPanningGesture={false}
        enableDynamicSizing={false}
        onChange={(index) => {
          if (index === -1) {
            setComments([]);
            setNewComment("");
            setReplyTo(null);
          }
        }}
      >
        <View style={styles.bottomSheetContent}>
          {/* Fixed Header */}
          <View style={styles.header}>
            <Text style={styles.commentTitle}>Comments</Text>
          </View>

          {/* Scrollable Comments */}
          {currentPostId && (
            <CommentSection
              post_id={currentPostId}
              comments={comments}
              setReplyTo={setReplyTo}
              setNewComment={setNewComment}
            />
          )}

          {/* Fixed Input Footer */}
          <View style={styles.inputContainer}>
            {replyTo && (
              <View style={styles.replyingToBar}>
                <Text style={styles.replyingToText}>
                  Replying to <Text style={styles.replyingToUsername}>@{replyTo.username}</Text>
                </Text>
                <TouchableOpacity onPress={() => {
                  setReplyTo(null);
                  setNewComment("");
                }}>
                  <MaterialCommunityIcons name="close" size={16} color="#666" />
                </TouchableOpacity>
              </View>
            )}
            <View style={styles.inputRow}>
              <TextInput
                value={newComment}
                onChangeText={setNewComment}
                placeholder={replyTo ? `Reply to @${replyTo.username}...` : "Add a comment..."}
                placeholderTextColor="#999"
                style={styles.input}
              />
              <TouchableOpacity onPress={handleSubmit} disabled={!newComment.trim()}>
                <Text style={[styles.sendText, !newComment.trim() && styles.sendTextDisabled]}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  flatList: {
    flex: 1,
  },
  videoContainer: {
    height: height,
    width: width,
    backgroundColor: 'black',
    position: 'relative',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width,
    height: height,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  playButton: {
    position: 'absolute',
    alignSelf: 'center',
    top: '45%',
    zIndex: 3,
  },
  optionsContainer: {
    position: 'absolute',
    right: 10,
    bottom: 100,
    zIndex: 10,
  },
  footerContainer: {
    position: 'absolute',
    left: 10,
    bottom: 80,
    zIndex: 2,
  },
  bottomSheetBackground: {
    backgroundColor: 'white',
  },
  bottomSheetHandle: {
    backgroundColor: 'white',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  bottomSheetContent: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  commentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 10,
    backgroundColor: 'white',
  },
  replyingToBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    marginBottom: 8,
    justifyContent: "space-between",
  },
  replyingToText: {
    fontSize: 12,
    color: "#666",
  },
  replyingToUsername: {
    fontWeight: "bold",
    color: "#007bff",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    fontSize: 14,
    color: "#333",
    marginRight: 10,
  },
  sendText: {
    color: "#007bff",
    fontWeight: "bold",
    fontSize: 16,
  },
  sendTextDisabled: {
    color: "#ccc",
  },
});