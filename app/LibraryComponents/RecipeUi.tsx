import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// Get screen dimensions for responsive design
const { width } = Dimensions.get('window');

interface RecipeProps {
  id: string;
  name: string;
  author: string;
  thumbnailUri: string;
  onPress: (id: string) => void;
  onMenuPress: (id: string) => void;
}

export default function RecipeUi({
  id,
  name,
  author,
  thumbnailUri,
  onPress,
  onMenuPress
}: RecipeProps) {
  // Default image if none provided
  const defaultImage = 'https://via.placeholder.com/150?text=Recipe';
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onPress(id)}
    >
      <Image 
        source={{ uri: thumbnailUri || defaultImage }} 
        style={styles.thumbnail}
        resizeMode="cover"
      />
      
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
          {name}
        </Text>
        <Text style={styles.author} numberOfLines={1} ellipsizeMode="tail">
          {author}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => onMenuPress(id)}
      >
        <MaterialCommunityIcons name="dots-vertical" size={24} color="black" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    marginBottom: 8,
    borderRadius: 8,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#000',
  },
  author: {
    fontSize: 14,
    color: '#666',
  },
  menuButton: {
    padding: 8,
  },
});