import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import UploadSelection from './UploadSelection';
import UploadSelected from './UploadSelected';

// Mock Colors
const Colors = {
  NavyBlueDark: '#003366',
  Grey: '#808080',
  LightGrey: '#d3d3d3',
  DisabledGrey: '#BDBDBD',
  White: '#ffffff',
  Black: '#000000',
  Green: '#4CAF50',
};

interface AttachedRecipe {
  recipeId: string;
}

export default function UploadVideo() {
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [caption, setCaption] = useState<string>('');
  const [attachedRecipeData, setAttachedRecipeData] = useState<AttachedRecipe | null>(null);

  const router = useRouter();
  const params = useLocalSearchParams<{ recipeData?: string }>();

  useEffect(() => {
    if (params.recipeData) {
      try {
        const recipe = JSON.parse(params.recipeData) as AttachedRecipe;
        setAttachedRecipeData(recipe);
        console.log("Recipe data attached:", recipe);
      } catch (e) {
        console.error("Failed to parse recipe data:", e);
        Alert.alert("Error", "Could not attach recipe data.");
      }
    }
  }, [params.recipeData]);

  const handleAttachRecipe = () => {
    if (!isUploadEnabled) return;

    setAttachedRecipeData(null);

    router.push({
      pathname: '/Upload/UploadRecipe',
      params: { videoUri: videoUri, caption: caption },
    });
  };

  const handleUpload = async () => {
    if (!isUploadEnabled) return;

    console.log('Initiating Upload...');
    console.log('Video URI:', videoUri);
    console.log('Caption:', caption);
    console.log('Attached Recipe Data:', attachedRecipeData);

    const recipeStatus = attachedRecipeData ? `Recipe ID: ${attachedRecipeData.recipeId}` : 'No Recipe Attached';
    Alert.alert(
      'Upload Action (Placeholder)',
      `Video: ${videoUri}\nCaption: ${caption}\nStatus: ${recipeStatus}`
    );
  };

  const isUploadEnabled = !!videoUri && caption.trim().length > 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Centered Video Selection/Preview Area */}
          <View style={styles.videoArea}>
            {videoUri ? (
              <UploadSelected videoUri={videoUri} onRemove={() => setVideoUri(null)} />
            ) : (
              <UploadSelection onVideoSelect={setVideoUri} />
            )}
          </View>

          {/* Spacer to push caption area down */}
          <View style={styles.spacer} />

          {/* Caption Input Area - Positioned Near Bottom Bar */}
          <View style={styles.captionArea}>
            <Text style={styles.heading}>Caption</Text>
            <TextInput
              placeholder="Write your caption here..."
              value={caption}
              onChangeText={setCaption}
              multiline
              maxLength={2000}
              style={styles.captionInput}
              placeholderTextColor={Colors.Grey}
            />
          </View>

          {/* Display if a recipe is attached */}
          {attachedRecipeData && (
            <View style={styles.recipeStatusArea}>
              <Ionicons name="checkmark-circle" size={18} color={Colors.Green} />
              <Text style={styles.recipeStatusText}>Recipe Attached!</Text>
              <TouchableOpacity onPress={handleAttachRecipe}>
                <Text style={styles.editRecipeText}> (Edit)</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        {/* Bottom Button Bar */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.button, styles.attachButton, !isUploadEnabled && styles.buttonDisabled]}
            onPress={handleAttachRecipe}
            disabled={!isUploadEnabled}
          >
            <Text style={styles.buttonText}>{attachedRecipeData ? "Edit Recipe" : "Attach Recipe"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.uploadButton, !isUploadEnabled && styles.buttonDisabled]}
            onPress={handleUpload}
            disabled={!isUploadEnabled}
          >
            <Text style={[styles.buttonText, styles.uploadButtonText]}>Upload</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20, // Reduced paddingBottom to bring caption closer to buttons
  },
  videoArea: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, // Allow video area to take available space and center itself
    marginBottom: -220,
  },
  spacer: {
    flex: 1, // Spacer takes remaining space to push caption area down
  },
  captionArea: {
    width: '100%',
    marginBottom: 10, // Minimal space between caption area and bottom bar
  },
  heading: {
    fontWeight: '600',
    fontSize: 16,
    color: Colors.Black,
    marginBottom: 10,
  },
  captionInput: {
    width: '100%',
    minHeight: 100,
    borderWidth: 1,
    borderColor: Colors.LightGrey,
    backgroundColor: Colors.White,
    paddingTop: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    textAlignVertical: 'top',
    fontSize: 16,
    color: Colors.Black,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  recipeStatusArea: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#e8f5e9',
    borderRadius: 20,
    alignSelf: 'center',
  },
  recipeStatusText: {
    fontSize: 14,
    color: Colors.Green,
    fontWeight: '500',
    marginLeft: 6,
  },
  editRecipeText: {
    fontSize: 14,
    color: Colors.NavyBlueDark,
    fontWeight: '500',
    marginLeft: 4,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
    backgroundColor: Colors.White,
  },
  button: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachButton: {
    backgroundColor: '#eef1f4',
    borderWidth: 1,
    borderColor: '#d0d7de',
  },
  uploadButton: {
    backgroundColor: Colors.Black,
  },
  buttonDisabled: {
    backgroundColor: Colors.DisabledGrey,
    borderColor: Colors.DisabledGrey,
    opacity: 0.6,
  },
  buttonText: {
    color: Colors.Black,
    fontSize: 15,
    fontWeight: '500',
  },
  uploadButtonText: {
    color: Colors.White,
  },
});