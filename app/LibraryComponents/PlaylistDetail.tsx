import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Platform,
  TouchableOpacity,
  TextInput,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecipeUi from './RecipeUi'; // Assuming RecipeUi component exists and is styled

// Get screen width for responsive design
const { width } = Dimensions.get('window');

// Mock data - replace with your actual data fetching logic
interface Recipe {
  id: string;
  name: string;
  author: string;
  thumbnailUri: string;
}

interface PlaylistDetails {
  id: string;
  title: string;
  description: string;
  recipeCount: number;
  createdAt: string;
  userImage: string;
  userName: string;
}

export default function PlaylistDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [playlist, setPlaylist] = useState<PlaylistDetails | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      setPlaylist({
        id: id as string,
        title: 'Italian Favorites',
        description: 'My collection of Italian recipes',
        recipeCount: 5,
        createdAt: '2 weeks ago',
        userImage: 'https://via.placeholder.com/60', // Placeholder image
        userName: 'Alex Johnson',
      });

      setRecipes([
         {
           id: '1',
           name: 'Classic Margherita Pizza',
           author: 'Mario Batali',
           thumbnailUri: 'https://via.placeholder.com/150/FF5733/ffffff?text=Pizza',
         },
         {
           id: '2',
           name: 'Creamy Carbonara',
           author: 'Giada De Laurentiis',
           thumbnailUri: 'https://via.placeholder.com/150/33FF57/ffffff?text=Pasta',
         },
         {
           id: '3',
           name: 'Tiramisu',
           author: 'Jamie Oliver',
           thumbnailUri: 'https://via.placeholder.com/150/3357FF/ffffff?text=Dessert',
         },
         {
           id: '4',
           name: 'Risotto Milanese',
           author: 'Gordon Ramsay',
           thumbnailUri: 'https://via.placeholder.com/150/F333FF/ffffff?text=Risotto',
         },
         {
           id: '5',
           name: 'Bruschetta',
           author: 'Ina Garten',
           thumbnailUri: 'https://via.placeholder.com/150/33FFF5/000000?text=Appetizer',
         },
      ]);

      setLoading(false);
    }, 800);
  }, [id]);

  const handleRecipePress = (recipeId: string) => {
    console.log(`Recipe selected: ${recipeId}`);
    // Navigate to recipe detail or perform action
  };

  const handleRecipeMenuPress = (recipeId: string) => {
    console.log(`Menu opened for recipe: ${recipeId}`);
    // Show options menu for the recipe
  };

  const handleBackPress = () => {
    router.back();
  };

  if (loading || !playlist) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    // Use edges top and bottom for safe area, especially if list scrolls behind bottom nav
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        {/* You could add a header title here if needed */}
      </View>

      {/* Scrollable content starts here if needed, but FlatList handles its own scroll */}
      {/* Playlist info */}
      <View style={styles.playlistInfo}>
        <Text style={styles.playlistTitle}>{playlist.title}</Text>
        {/* User Row - Corrected Alignment */}
        <View style={styles.userRow}>
          <Image
            source={{ uri: playlist.userImage }}
            style={styles.userImage}
          />
          <Text style={styles.userName}>{playlist.userName}</Text>
        </View>
        <Text style={styles.playlistDescription}>{playlist.description}</Text>
        <Text style={styles.playlistMeta}>
          {playlist.recipeCount} {playlist.recipeCount === 1 ? 'recipe' : 'recipes'} • Created {playlist.createdAt}
        </Text>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <AntDesign name="search1" size={20} color="gray" style={styles.searchIcon} />
        <TextInput
          placeholder="Search recipes..."
          style={styles.searchInput}
          placeholderTextColor="#999"
        />
      </View>

      {/* Recipe List */}
      <FlatList
        contentContainerStyle={styles.recipeListContent}
        data={recipes}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <RecipeUi // Ensure RecipeUi component is styled appropriately
            id={item.id}
            name={item.name}
            author={item.author}
            thumbnailUri={item.thumbnailUri}
            onPress={handleRecipePress}
            onMenuPress={handleRecipeMenuPress}
          />
        )}
        // Optionally add ListHeaderComponent if you want the info/search part to scroll with the list
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10, // Reduced vertical padding slightly
    paddingHorizontal: 16, // Keep horizontal padding for general alignment
    // backgroundColor: 'lightblue', // uncomment to visualize header area
  },
  backButton: {
    // Apply negative margin to counteract header padding JUST for this button
    marginLeft: -8, // Pulls button 8px to the left
    padding: 8, // Keep padding for touch target size
    // backgroundColor: 'lightcoral', // uncomment to visualize button area
  },
  playlistInfo: {
    paddingHorizontal: 16, // Main content padding
    paddingBottom: 16,
  },
  playlistTitle: {
    fontSize: 28,
    fontWeight: '700', // Bold
    marginBottom: 12,
    color: '#222', // Slightly darker text
  },
  // --- User Row: Corrected ---
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, // Slightly more space below user row
    // Removed marginLeft: -16
    // Removed paddingLeft: 16
    // Removed width: '100%'
  },
  userImage: {
    width: 24,
    height: 24,
    borderRadius: 12, // Circular image
    marginRight: 8,
    backgroundColor: '#eee', // Added placeholder bg color
  },
  userName: {
    fontSize: 15,
    fontWeight: '500', // Medium weight
    color: '#333',
  },
  playlistDescription: {
    fontSize: 14,
    color: '#666', // Slightly darker grey
    fontWeight: '400',
    marginBottom: 8,
    lineHeight: 20, // Improve readability
  },
  playlistMeta: {
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
  },
  divider: {
    height: 1,
    backgroundColor: '#e8e8e8', // Lighter divider
    marginHorizontal: 16, // Align divider with content padding
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', // Slightly lighter search bg
    borderRadius: 10, // Slightly less rounded
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    height: 45,
    // Removed shadow for a flatter look, uncomment if shadow is desired
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
    // elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  recipeListContent: {
    paddingHorizontal: 16, // Padding for list items
    paddingBottom: 16, // Padding at the bottom of the list
  },
});