import { View, ActivityIndicator } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import ReelVideo from "./ReelVideo";
import axios from "axios";
import { AuthContext } from "@/context/AuthContext"; // Get logged-in user ID

export default function Following() {
  const { user } = useContext(AuthContext); // Logged-in user
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowingReels = async () => {
      try {
        if (!user?.id) return;
        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_HOST_URL}/followingreels?user_id=${user.id}`
        );
        setVideos(response.data);
      } catch (error) {
        console.error("❌ Error fetching reels:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowingReels();
  }, [user?.id]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black" }}>
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      <ReelVideo videos={videos} />
    </View>
  );
}
