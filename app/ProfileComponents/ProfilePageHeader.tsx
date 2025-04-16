import { View, Text, Image } from 'react-native';
import React from 'react';

interface ProfilePageHeaderProps {
  name: string;
  image: string;
  followers: number;
  following: number;
  posts: number;
}

export default function ProfilePageHeader({ name, image, followers, following, posts }: ProfilePageHeaderProps) {
  return (
    <View style={{
      padding: 20,
      borderRadius: 10
    }}>
      {/* Profile Section */}
      <View style={{
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between'
      }}>
        {/* Profile Image */}
        <Image 
          source={{ uri: image }} 
          style={{ 
            width: 75, 
            height: 75, 
            borderRadius: 99, 
          }} 
        />

        {/* Name & Stats */}
        <View style={{ flex: 1, marginLeft: 20 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
            {name}
          </Text>

          {/* Followers, Following, Posts */}
          <View style={{ flexDirection: 'row', marginTop: 5 }}>
            <View style={{ alignItems: 'center', marginRight: 20 }}>
              <Text style={{ fontWeight: 'bold' }}>{followers}</Text>
              <Text>Followers</Text>
            </View>

            <View style={{ alignItems: 'center', marginRight: 20 }}>
              <Text style={{ fontWeight: 'bold' }}>{following}</Text>
              <Text>Following</Text>
            </View>

            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontWeight: 'bold' }}>{posts}</Text>
              <Text>Posts</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
