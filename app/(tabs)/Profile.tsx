import { View, ActivityIndicator, TouchableOpacity, Text } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import ProfilePageHeader from '@/app/ProfileComponents/ProfilePageHeader';
import ProfilePagePosts from '@/app/ProfileComponents/ProfilePagePosts';
import { AuthContext } from '@/context/AuthContext';
import axios from 'axios';

interface UserData {
  name: string;
  image: string;
  followers: number;
  following: number;
  posts: number;
  user_posts: Array<{
    id: string;
    media_url: string;
  }>;
}

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!user?.name) return;

        setLoading(true);
        const response = await axios.get(
          `${process.env.EXPO_PUBLIC_HOST_URL}/userprofile?name=${user.name}&loggedInUserId=${user?.id}`
        );
        setUserData(response.data);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user?.name]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error || !userData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, color: 'red' }}>{error || 'Failed to load user data'}</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 0 }}>
      {/* Header */}
      <ProfilePageHeader
        name={userData.name}
        image={userData.image}
        followers={userData.followers}
        following={userData.following}
        posts={userData.posts}
      />

      {/* Edit Profile Button */}
      <TouchableOpacity
        style={{
          marginTop: 10,
          marginBottom: 10,
          marginLeft: 15,
          backgroundColor: '#ddd',
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderRadius: 5,
          alignSelf: 'flex-start',
        }}
      >
        <Text style={{ fontWeight: 'bold', color: '#333' }}>Edit Profile</Text>
      </TouchableOpacity>

      {/* Posts Grid */}
      <ProfilePagePosts posts={userData.user_posts} />
    </View>
  );
}
