import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

// Get screen width to calculate grid item size
const { width } = Dimensions.get('window');
const GRID_ITEM_WIDTH = (width - 48) / 2; // 2 columns with padding

interface PlaylistProps {
  id: string;
  title: string;
  description: string;
  recipeCount: number;
  viewType: 'grid' | 'list';
  onPress: (id: string) => void;
}

export default function PlaylistUI({
  id,
  title,
  description,
  recipeCount,
  viewType,
  onPress
}: PlaylistProps) {
  
  // Generate placeholder images for the collage
  // In a real app, these would be images from recipes in the playlist
  const generatePlaceholderImages = (count: number) => {
    // Use up to 4 images for the collage
    const actualCount = Math.min(count, 4);
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#F333FF'];
    
    return Array(actualCount).fill(0).map((_, i) => 
      `https://via.placeholder.com/150/${colors[i].replace('#', '')}?text=Recipe${i+1}`
    );
  };
  
  // Get placeholder images - these would come from recipe data
  const recipeImages = generatePlaceholderImages(recipeCount > 0 ? recipeCount : 4);
  
  if (viewType === 'grid') {
    return (
      <TouchableOpacity 
        style={styles.gridContainer}
        onPress={() => onPress(id)}
      >
        <View style={styles.gridImageContainer}>
          {recipeImages.length === 0 ? (
            // Empty playlist
            <View style={styles.emptyImage}>
              <Ionicons name="restaurant-outline" size={40} color="#aaa" />
            </View>
          ) : recipeImages.length === 1 ? (
            // Single image
            <Image 
              source={{ uri: recipeImages[0] }} 
              style={styles.gridSingleImage}
              resizeMode="cover"
            />
          ) : (
            // Collage of 2-4 images
            <View style={styles.gridCollage}>
              {recipeImages.map((uri, index) => (
                <Image 
                  key={index}
                  source={{ uri }} 
                  style={[
                    styles.gridCollageImage,
                    recipeImages.length === 2 && styles.twoImagesGrid,
                    recipeImages.length === 3 && (index === 0 ? styles.threeImagesFirst : styles.threeImagesOthers),
                  ]}
                  resizeMode="cover"
                />
              ))}
            </View>
          )}
        </View>
        <View style={styles.gridInfo}>
          <Text style={styles.gridTitle} numberOfLines={1} ellipsizeMode="tail">
            {title}
          </Text>
          <Text style={styles.gridCount}>
            {recipeCount} {recipeCount === 1 ? 'recipe' : 'recipes'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
  
  return (
    <TouchableOpacity 
      style={styles.listContainer}
      onPress={() => onPress(id)}
    >
      <View style={styles.listImageContainer}>
        {recipeImages.length === 0 ? (
          // Empty playlist
          <View style={styles.emptyListImage}>
            <Ionicons name="restaurant-outline" size={30} color="#aaa" />
          </View>
        ) : recipeImages.length === 1 ? (
          // Single image
          <Image 
            source={{ uri: recipeImages[0] }} 
            style={styles.listImage}
            resizeMode="cover"
          />
        ) : (
          // Collage for list view with 2-4 images
          <View style={styles.listCollage}>
            {recipeImages.slice(0, 4).map((uri, index) => (
              <Image 
                key={index}
                source={{ uri }} 
                style={styles.listCollageImage}
                resizeMode="cover"
              />
            ))}
          </View>
        )}
      </View>
      <View style={styles.listInfo}>
        <Text style={styles.listTitle} numberOfLines={1} ellipsizeMode="tail">
          {title}
        </Text>
        <Text style={styles.listDescription} numberOfLines={1} ellipsizeMode="tail">
          {description}
        </Text>
        <Text style={styles.listCount}>
          {recipeCount} {recipeCount === 1 ? 'recipe' : 'recipes'}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Grid View Styles
  gridContainer: {
    width: GRID_ITEM_WIDTH,
    height: GRID_ITEM_WIDTH * 1.3,
    margin: 8,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  gridImageContainer: {
    width: '100%',
    height: GRID_ITEM_WIDTH,
    backgroundColor: '#f0f0f0',
  },
  gridSingleImage: {
    width: '100%',
    height: '100%',
  },
  gridCollage: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridCollageImage: {
    width: '50%',
    height: '50%',
  },
  twoImagesGrid: {
    width: '100%',
    height: '50%',
  },
  threeImagesFirst: {
    width: '100%',
    height: '50%',
  },
  threeImagesOthers: {
    width: '50%',
    height: '50%',
  },
  emptyImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  gridInfo: {
    padding: 10,
    flex: 1,
    justifyContent: 'center',
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  gridCount: {
    fontSize: 12,
    color: '#777',
  },
  
  // List View Styles
  listContainer: {
    flexDirection: 'row',
    padding: 12,
    marginHorizontal: 12,
    marginVertical: 6,
    backgroundColor: '#fff',
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  listImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  listImage: {
    width: '100%',
    height: '100%',
  },
  listCollage: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  listCollageImage: {
    width: '50%',
    height: '50%',
  },
  emptyListImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  listInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  listDescription: {
    fontSize: 14,
    color: '#777',
    marginBottom: 4,
  },
  listCount: {
    fontSize: 12,
    color: '#777',
  },
});