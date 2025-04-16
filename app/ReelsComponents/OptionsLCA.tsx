import { View, Pressable, StyleSheet, Text, TouchableOpacity } from "react-native";
import React, { useState, useContext,  } from "react";
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  Extrapolate,
  interpolate,
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext"; // Import Auth Context to get logged-in user
import { useRouter } from "expo-router";


export default function OptionsLCA({ post_id, likes, comments, userlike, openComments }: { post_id: string; likes: number; comments: number; userlike: boolean; openComments: () => void; }) {
  const { user } = useContext(AuthContext); // Get logged-in user's info
  const liked = useSharedValue(userlike ? 1 : 0); // Initialize based on userlike
  const [likeCount, setLikeCount] = useState(likes);
  const [isLiked, setIsLiked] = useState(userlike); // Initialize state
  const router = useRouter();
  


  const handleLikeToggle = async () => {
    if (!user?.id) return;

    try {
      if (isLiked) {
        // UNLIKE the post (DELETE request)
        await axios.delete(`${process.env.EXPO_PUBLIC_HOST_URL}/reellikeunlike`, {
          data: { user_id: user.id, post_id },
        });
        setLikeCount((prev) => prev - 1);
        liked.value = withSpring(0);
      } else {
        // LIKE the post (POST request)
        await axios.post(`${process.env.EXPO_PUBLIC_HOST_URL}/reellikeunlike`, {
          user_id: user.id,
          post_id,
        });
        setLikeCount((prev) => prev + 1);
        liked.value = withSpring(1);
      }

      setIsLiked(!isLiked);
    } catch (error) {
      console.error("❌ Like/Unlike error:", error);
    }
  };

  // Outline heart animation (scales down when liked)
  const outlineStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(liked.value, [0, 1], [1, 0], Extrapolate.CLAMP),
        },
      ],
    };
  });

  // Filled heart animation (scales up when liked)
  const fillStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: liked.value }],
      opacity: liked.value,
    };
  });

  return (
    <>
      <View style={styles.container}>
        {/* Like Button with Animation */}
        <Pressable style={styles.option} onPress={handleLikeToggle}>
          {/* Outlined Heart */}
          <Animated.View style={[StyleSheet.absoluteFillObject, outlineStyle]}>
            <MaterialCommunityIcons name="heart-outline" size={35} color="white" />
          </Animated.View>

          {/* Filled Heart */}
          <Animated.View style={fillStyle}>
            <MaterialCommunityIcons name="heart" size={35} color="red" />
          </Animated.View>
        </Pressable>
        {/* Like Count */}
        <Text style={styles.countText}>{likeCount}</Text>

        {/* Comment Button */}
        <TouchableOpacity style={styles.option} onPress={openComments}>
          <FontAwesome name="comment-o" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.countText}>{comments}</Text>

        {/* Add Recipe Button */}
        <TouchableOpacity style={styles.option}>
          <FontAwesome6 name="add" size={30} color="white" />
        </TouchableOpacity>
      </View>
      
 
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    zIndex: 10000,
  },
  option: {
    marginVertical: 15, // Keep spacing between icons
  },
  countText: {
    color: "white",
    fontSize: 14,
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: 'center',
  },
  bottomSheetContainer: {
    flex: 1,
    paddingTop: 200, // This allows touch events to pass through to components underneath
  }
});