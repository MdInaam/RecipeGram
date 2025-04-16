import { View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import ProfilePageHeader from '@/app/ProfileComponents/ProfilePageHeader';
import ProfilePagePosts from '@/app/ProfileComponents/ProfilePagePosts';
import { AuthContext } from '@/context/AuthContext'; // Import Auth Context

// Define a type for your user data
interface UserData {
  id: number
  name: string;
  image: string;
  followers: number;
  following: number;
  posts: number;
  is_following: boolean;  // NEW FIELD
  user_posts: Array<{
    id: string;
    media_url: string;
  }>;
}

export default function UserProfile() {
  const { username } = useLocalSearchParams(); // Extract username from route params
  const { user } = useContext(AuthContext); // Get logged-in user details
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_HOST_URL}/userprofile?name=${username}&loggedInUserId=${user?.id}`
        );
        setUserData(response.data);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("User not found");
      } finally {
        setLoading(false);
      }
    };

    if (username && user?.id) {
      fetchUserData();
    } else {
      setError("No username provided");
      setLoading(false);
    }
  }, [username, user?.id]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error || !userData) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 18, color: "red" }}>{error || "Failed to load user data"}</Text>
      </View>
    );
  }

  const handleFollowToggle = async () => {
    if (!user || !userData) return;
  
    const url = `${process.env.EXPO_PUBLIC_HOST_URL}/follow`;
    const requestData = { follower_id: user.id, following_id: userData.id };
  
    try {
      if (userData.is_following) {
        // UNFOLLOW
        await axios.delete(url, { data: requestData });
        setUserData((prev) => prev ? { ...prev, is_following: false, followers: prev.followers - 1 } : null);
      } else {
        // FOLLOW
        await axios.post(url, requestData);
        setUserData((prev) => prev ? { ...prev, is_following: true, followers: prev.followers + 1 } : null);
      }
    } catch (error) {
      console.error("❌ Follow/Unfollow error:", error);
    }
  };



  return (
    <View style={{ padding: 0 }}>
      <ProfilePageHeader
        name={userData.name}
        image={userData.image}
        followers={userData.followers}
        following={userData.following}
        posts={userData.posts}
      />

      {/* Follow Button */}
      <TouchableOpacity
        onPress={handleFollowToggle}
        style={{
          marginTop: 10,
          marginBottom: 10,
          marginLeft: 15,
          backgroundColor: userData.is_following ? "#ccc" : "#1DA1F2",
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 5,
          alignSelf: "flex-start",
        }}
>
        <Text style={{ fontWeight: "bold", color: userData.is_following ? "black" : "white" }}>
          {userData.is_following ? "Following" : "Follow"}
        </Text>
      </TouchableOpacity>

      {/* Posts Grid */}
      <ProfilePagePosts posts={userData.user_posts} />
    </View>
  );
}
