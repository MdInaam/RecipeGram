import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Modal,
  FlatList,
  LayoutAnimation,
  UIManager,
  Dimensions,
} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Ionicons from '@expo/vector-icons/Ionicons';
import PlaylistUi from './PlaylistUi';
import { useRouter } from 'expo-router';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// Playlist type definition
interface Playlist {
  id: string;
  title: string;
  description: string;
  recipeCount: number;
}

export default function RecipeLibrary() {
  // Modal & input states
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTitleFocused, setIsTitleFocused] = useState(false);
  const [isDescriptionFocused, setIsDescriptionFocused] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const router = useRouter();
  
  // View type state (grid or list)
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  
  // Playlists state
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  
  // Toggle modal and reset inputs
  const handleToggleModal = () => {
    setIsModalVisible(!isModalVisible);
    if (!isModalVisible) {
      // Reset inputs when opening
      setTitle('');
      setDescription('');
    }
    
    // Reset focus states when closing
    setIsTitleFocused(false);
    setIsDescriptionFocused(false);
  };

  // Create a new playlist
  const handleCreatePlaylist = () => {
    if (!title.trim()) return; // Require at least a title
    
    // Create new playlist and add to state
    const newPlaylist: Playlist = {
      id: Date.now().toString(), // Simple ID generation
      title: title.trim(),
      description: description.trim(),
      // Add a random number of recipes (1-6) for demonstration
      // This would be 0 in a real app until recipes are added
      recipeCount: Math.floor(Math.random() * 6) + 1,
    };
    
    setPlaylists([...playlists, newPlaylist]);
    handleToggleModal(); // Close modal after creating
  };

  // Toggle between grid and list views
  const toggleViewType = () => {
    // Animate the layout change
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setViewType(viewType === 'grid' ? 'list' : 'grid');
  };

  // Handle playlist selection
  const handlePlaylistPress = (id: string) => {
    console.log(`Playlist selected: ${id}`);
    router.push(`../LibraryComponents/PlaylistDetail/`);
  };

  // Colors for focus/blur
  const activeBorderColor = '#3498db'; // Blue for active input
  const inactiveBorderColor = '#cccccc'; // A slightly lighter grey for inactive inputs

  return (
    <View style={styles.container}>
      {/* Top right view toggle icon */}
      <TouchableOpacity style={styles.gridButton} onPress={toggleViewType}>
        <Ionicons 
          name={viewType === 'grid' ? 'list' : 'grid'} 
          size={24} 
          color="black" 
        />
      </TouchableOpacity>

      {/* Main content area */}
      <View style={styles.contentArea}>
        {playlists.length === 0 ? (
          // Empty state when no playlists
          <View style={styles.emptyState}>
            <Text style={styles.title}>Recipe Library</Text>
            <Text style={styles.text}>Here you'll see your saved recipes</Text>
          </View>
        ) : (
          // FlatList of playlists
          <FlatList
            data={playlists}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <PlaylistUi
                id={item.id}
                title={item.title}
                description={item.description}
                recipeCount={item.recipeCount}
                viewType={viewType}
                onPress={handlePlaylistPress}
              />
            )}
            numColumns={viewType === 'grid' ? 2 : 1}
            key={viewType} // Force remount when view type changes
            contentContainerStyle={styles.flatListContainer}
          />
        )}
      </View>

      {/* Bottom bar */}
      <View style={styles.bottomBar}>
        <View style={styles.searchContainer}>
          <AntDesign name="search1" size={20} color="gray" style={styles.searchIcon} />
          <TextInput
            placeholder="Search recipes..."
            style={styles.searchInput}
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleToggleModal}>
          <AntDesign name="pluscircle" size={38} color="#000000" />
        </TouchableOpacity>
      </View>

      {/* Modal Component */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleToggleModal}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={handleToggleModal}
          />
          <View style={styles.modalView}>
            <Text style={styles.sheetTitle}>New playlist</Text>
            <TextInput
              style={[
                styles.inputBase,
                styles.titleInput,
                { borderBottomColor: isTitleFocused ? activeBorderColor : inactiveBorderColor }
              ]}
              placeholder="Title"
              placeholderTextColor="#999"
              onFocus={() => setIsTitleFocused(true)}
              onBlur={() => setIsTitleFocused(false)}
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[
                styles.inputBase,
                styles.descriptionInput,
                { borderBottomColor: isDescriptionFocused ? activeBorderColor : inactiveBorderColor }
              ]}
              placeholder="Description"
              placeholderTextColor="#999"
              multiline
              onFocus={() => setIsDescriptionFocused(true)}
              onBlur={() => setIsDescriptionFocused(false)}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleToggleModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.createButton,
                  // Disable button if title is empty
                  !title.trim() && styles.createButtonDisabled
                ]}
                onPress={handleCreatePlaylist}
                disabled={!title.trim()}>
                <Text style={styles.createButtonText}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  gridButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 30,
    right: 20,
    zIndex: 10,
  },
  contentArea: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 80 : 50,
    paddingBottom: 80,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#555',
  },
  flatListContainer: {
    padding: 8,
    paddingBottom: 20,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#f8f8f8',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
  },
  searchContainer: {
    flex: 1,
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 25,
    marginRight: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#333',
  },
  addButton: {
    padding: 5,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 25,
    width: '90%',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#111111',
    marginBottom: 30,
    textAlign: 'left',
  },
  inputBase: {
    color: '#333',
    fontSize: 16,
    paddingHorizontal: 2,
    paddingBottom: 8,
    marginBottom: 25,
  },
  titleInput: {
     height: 40,
     borderBottomWidth: 2,
  },
  descriptionInput: {
    minHeight: 60,
    borderBottomWidth: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  createButton: {
    backgroundColor: '#000000',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: '#999999',
  },
  createButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});