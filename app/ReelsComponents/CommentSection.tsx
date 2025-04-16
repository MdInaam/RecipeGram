import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import Animated, { useSharedValue, withSpring, useAnimatedStyle, Extrapolate, interpolate } from "react-native-reanimated";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, TouchableOpacity } from "react-native";

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

type Reply = {
  id: number;
  user_id: number;
  post_id: string;
  text: string;
  created_at: string;
  parent_id?: number | null;
  username?: string;
  profile_image?: string;
  likes?: number;
  userlike?: boolean;
};

function timeSince(dateString: string): string {
  const seconds = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 1000);
  const intervals = [
    { label: "y", seconds: 31536000 },
    { label: "mo", seconds: 2592000 },
    { label: "w", seconds: 604800 },
    { label: "d", seconds: 86400 },
    { label: "h", seconds: 3600 },
    { label: "m", seconds: 60 },
    { label: "s", seconds: 1 },
  ];
  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) return `${count}${interval.label}`;
  }
  return "Just now";
}

function renderWithMentions(text: string) {
  if (!text) return <Text></Text>;
  const parts = text.split(/(@\w+)/g);
  return (
    <Text style={styles.commentText}>
      {parts.map((part, index) => (
        <Text key={index} style={part.startsWith('@') ? styles.mentionText : undefined}>{part}</Text>
      ))}
    </Text>
  );
}

const ReplyItem = ({ reply, setReplyTo, setNewComment, handleLikeToggle }: {
  reply: Reply;
  setReplyTo: (value: { id: number; username: string } | null) => void;
  setNewComment: (value: string) => void;
  handleLikeToggle: (comment_id: number, isLiked: boolean, updateState: (likes: number, userlike: boolean) => void) => void;
}) => {
  const liked = useSharedValue(reply.userlike ? 1 : 0);
  const [likes, setLikes] = useState(reply.likes || 0);
  const [userlike, setUserlike] = useState(reply.userlike || false);

  const outlineStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(liked.value, [0, 1], [1, 0], Extrapolate.CLAMP) }],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    transform: [{ scale: liked.value }],
    opacity: liked.value,
  }));

  const updateState = (delta: number, likedFlag: boolean) => {
    setLikes((prev) => prev + delta);
    setUserlike(likedFlag);
    liked.value = withSpring(likedFlag ? 1 : 0);
  };

  return (
    <View key={reply.id.toString()} style={styles.replyContainer}>
      <Image source={{ uri: reply.profile_image || "https://via.placeholder.com/32" }} style={styles.replyProfileImage} />
      <View style={styles.replyContent}>
        <View style={styles.replyHeader}>
          <Text style={styles.username}>{reply.username || ""}</Text>
          <Text style={styles.timestamp}>• {timeSince(reply.created_at)}</Text>
        </View>
        {renderWithMentions(reply.text)}
        <View style={styles.actionButtons}>
          <TouchableOpacity onPress={() => {
            setReplyTo({ id: reply.parent_id || 0, username: reply.username || "" });
            setNewComment(`@${reply.username} `);
          }}>
            <Text style={styles.replyText}>Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.likeContainer}>
        <TouchableOpacity
          onPress={() => {
            console.log("🔘 Like Pressed:", reply.id);
            handleLikeToggle(reply.id, userlike, updateState);
          }}
          style={styles.likeButton}
        >
          <Animated.View style={[styles.iconContainer, outlineStyle]}>
            <MaterialCommunityIcons name="heart-outline" size={18} color="gray" />
          </Animated.View>
          <Animated.View style={[styles.iconContainer, fillStyle]}>
            <MaterialCommunityIcons name="heart" size={18} color="red" />
          </Animated.View>
        </TouchableOpacity>
        <Text style={styles.likeCount}>{likes}</Text>
      </View>
    </View>
  );
};

const CommentItem = ({
  item,
  setReplyTo,
  setNewComment,
  fetchReplies,
  openReplies,
  setOpenReplies,
  handleLikeToggle
}: {
  item: Comment;
  setReplyTo: (value: { id: number; username: string } | null) => void;
  setNewComment: (value: string) => void;
  fetchReplies: (parentId: number) => void;
  openReplies: { [commentId: number]: Reply[] };
  setOpenReplies: React.Dispatch<React.SetStateAction<{ [commentId: number]: Reply[] }>>;
  handleLikeToggle: (comment_id: number, isLiked: boolean, updateState: (likes: number, userlike: boolean) => void) => void;
}) => {
  const liked = useSharedValue(item.userlike ? 1 : 0);
  const [likes, setLikes] = useState(item.likes || 0);
  const [userlike, setUserlike] = useState(item.userlike || false);

  const outlineStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(liked.value, [0, 1], [1, 0], Extrapolate.CLAMP) }],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    transform: [{ scale: liked.value }],
    opacity: liked.value,
  }));

  const updateState = (delta: number, likedFlag: boolean) => {
    setLikes((prev) => prev + delta);
    setUserlike(likedFlag);
    liked.value = withSpring(likedFlag ? 1 : 0);
  };

  const getReplyText = () => {
    if (openReplies[item.id]) {
      return "Hide replies";
    }
    if (item.reply_count === 1) {
      return "View 1 reply";
    }
    return `View ${item.reply_count} replies`;
  };

  return (
    <View style={styles.commentWrapper}>
      <View style={styles.commentContainer}>
        <Image source={{ uri: item.profile_image || "https://via.placeholder.com/40" }} style={styles.profileImage} />
        <View style={styles.commentContent}>
          <View style={styles.commentHeader}>
            <Text style={styles.username}>{item.username || ""}</Text>
            <Text style={styles.timestamp}>• {timeSince(item.created_at)}</Text>
          </View>
          {renderWithMentions(item.text)}
          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={() => {
              setReplyTo({ id: item.id, username: item.username || "" });
              setNewComment(`@${item.username} `);
            }}>
              <Text style={styles.replyText}>Reply</Text>
            </TouchableOpacity>
            {item.reply_count ? (
              <TouchableOpacity
                style={styles.viewRepliesButton}
                onPress={() => {
                  if (openReplies[item.id]) {
                    setOpenReplies((prev) => {
                      const newState = { ...prev };
                      delete newState[item.id];
                      return newState;
                    });
                  } else {
                    fetchReplies(item.id);
                  }
                }}
              >
                <Text style={styles.replyText}>{getReplyText()}</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        <View style={styles.likeContainer}>
          <TouchableOpacity
            onPress={() => {
              console.log("🔘 Like Pressed:", item.id);
              handleLikeToggle(item.id, userlike, updateState);
            }}
            style={styles.likeButton}
          >
            <Animated.View style={[styles.iconContainer, outlineStyle]}>
              <MaterialCommunityIcons name="heart-outline" size={20} color="gray" />
            </Animated.View>
            <Animated.View style={[styles.iconContainer, fillStyle]}>
              <MaterialCommunityIcons name="heart" size={20} color="red" />
            </Animated.View>
          </TouchableOpacity>
          <Text style={styles.likeCount}>{likes}</Text>
        </View>
      </View>
      {openReplies[item.id] && openReplies[item.id].length > 0 && (
        <View style={styles.repliesSection}>
          {openReplies[item.id].map(reply => (
            <ReplyItem
              key={reply.id.toString()}
              reply={reply}
              setReplyTo={setReplyTo}
              setNewComment={setNewComment}
              handleLikeToggle={handleLikeToggle}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default function CommentSection({ 
  post_id, 
  comments, 
  setReplyTo, 
  setNewComment 
}: { 
  post_id: string, 
  comments: Comment[], 
  setReplyTo: (value: { id: number; username: string } | null) => void, 
  setNewComment: (value: string) => void 
}) {
  const { user } = useContext(AuthContext);
  const [openReplies, setOpenReplies] = useState<{ [commentId: number]: Reply[] }>({});

  const handleLikeToggle = async (comment_id: number, isLiked: boolean, updateState: (likes: number, userlike: boolean) => void) => {
    try {
      if (isLiked) {
        await axios.delete(`${process.env.EXPO_PUBLIC_HOST_URL}/commentlikeunlike`, {
          data: { user_id: user?.id, comment_id }
        });
        updateState(-1, false);
      } else {
        await axios.post(`${process.env.EXPO_PUBLIC_HOST_URL}/commentlikeunlike`, {
          user_id: user?.id,
          comment_id
        });
        updateState(1, true);
      }
    } catch (error) {
      console.error("❌ Like toggle failed:", error);
    }
  };

  const fetchReplies = async (parentId: number) => {
    try {
      const res = await axios.get(`${process.env.EXPO_PUBLIC_HOST_URL}/commentreplies?parent_id=${parentId}&user_id=${user?.id}`);
      setOpenReplies((prev) => ({
        ...prev,
        [parentId]: res.data,
      }));
    } catch (err) {
      console.error(`Error fetching replies for comment ${parentId}:`, err);
    }
  };

  const mainComments = comments.filter(c => !c.parent_id);

  return (
    <View style={styles.container}>
      {!mainComments.length ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Comments Yet..</Text>
          <Text style={styles.emptyText}>Be The First One To Comment!</Text>
        </View>
      ) : (
        <FlatList
          data={mainComments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <CommentItem
              item={item}
              setReplyTo={setReplyTo}
              setNewComment={setNewComment}
              fetchReplies={fetchReplies}
              openReplies={openReplies}
              setOpenReplies={setOpenReplies}
              handleLikeToggle={handleLikeToggle}
            />
          )}
          contentContainerStyle={styles.commentsList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  commentWrapper: {
    marginBottom: 16,
  },
  commentContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  username: {
    fontWeight: "600",
    fontSize: 14,
  },
  commentText: {
    fontSize: 14,
    color: "#333",
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: "row",
    marginTop: 6,
  },
  viewRepliesButton: {
    marginLeft: 15,
  },
  repliesSection: {
    marginLeft: 50,
    marginTop: 6,
  },
  replyContainer: {
    flexDirection: "row",
    marginBottom: 10,
    paddingTop: 4,
  },
  replyContent: {
    flex: 1,
  },
  replyHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  replyProfileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  likeContainer: {
    alignItems: "center",
    marginLeft: 8,
  },
  likeButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeCount: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
    textAlign: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: "#888",
    marginLeft: 6,
  },
  replyText: {
    fontSize: 13,
    color: "#007bff",
    fontWeight: "500",
  },
  commentsList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  mentionText: {
    color: '#007bff',
    fontWeight: '500',
  },
});