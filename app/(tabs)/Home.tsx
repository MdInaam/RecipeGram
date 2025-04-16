import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useState, useContext } from 'react';
import { useRouter } from 'expo-router';
import { AuthContext } from '@/context/AuthContext';

export default function Home() {
  const [username, setUsername] = useState('');
  const router = useRouter(); // Expo Router
  const { user } = useContext(AuthContext); // Get logged-in user details

  const handleSearch = () => {
    if (!username.trim()) return; // Prevent empty search

    if (username.toLowerCase() === user?.name.toLowerCase()) {
      // If the entered username matches the logged-in user, navigate to Profile.tsx
      router.push('/(tabs)/Profile');
    } else {
      // Otherwise, navigate to UserProfile.tsx and pass the username as a query param
      router.push({
        pathname: '/ProfileComponents/UserProfile',
        params: { username },
      });
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
        Search for a User
      </Text>

      {/* Input Field */}
      <TextInput
        placeholder="Enter username..."
        value={username}
        onChangeText={setUsername}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          borderRadius: 5,
          marginBottom: 10,
        }}
      />

      {/* Search Button */}
      <TouchableOpacity
        onPress={handleSearch}
        style={{
          backgroundColor: '#1DA1F2',
          paddingVertical: 10,
          borderRadius: 5,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Search</Text>
      </TouchableOpacity>
    </View>
  );
}
