import { View, TextInput, TouchableOpacity, Text, StyleSheet, ToastAndroid } from 'react-native';
import React, { useContext, useState } from 'react';
import Colors from '@/Data/Colors';
import { cld, options } from '@/configs/CloudinaryVideo';
import { upload } from 'cloudinary-react-native';
import { AuthContext } from '@/context/AuthContext';
import axios from 'axios';


export default function UploadCaption({ videoUri }: { videoUri: string | null }) {
  const [caption, setCaption] = useState('');
  const {user}=useContext(AuthContext)
  const [recipe, setRecipe] = useState('');

    
  

  const handleUpload = async () => {
    try {
      if (!videoUri) {
        ToastAndroid.show('Please select a video to upload', ToastAndroid.SHORT);
        return;
      }
  
      if (!caption) {
        ToastAndroid.show('Please enter caption', ToastAndroid.SHORT);
        return;
      }

      if (!caption) {
        ToastAndroid.show('Please enter caption', ToastAndroid.SHORT);
        return;
      }
  
      console.log('Uploading Video:', videoUri);
      console.log('Caption:', caption);
      console.log('UserID:', user?.id);
      console.log('Recipe:', recipe);
  
      // Uploading to Cloudinary
      let uploadVideoUrl = '';
      console.log("Starting Cloudinary upload...");
  
      const resultData: any = await new Promise(async (resolve, reject) => {
        await upload(cld, {
          file: videoUri,
          options: {
            ...options,
            resource_type: "video",  // Explicitly set resource type
          },
          callback: (error: any, response: any) => {
            if (error) {
              console.log("Cloudinary Upload Error:", error);
              reject(error);
            }
            if (response) {
              console.log("Cloudinary Upload Response:", response);
              resolve(response);
            }
          }
        });
      });
  
      uploadVideoUrl = resultData?.url || '';
      console.log("Upload Video URL:", uploadVideoUrl);
  
      if (!uploadVideoUrl) {
        console.error("Failed to get uploadVideoUrl. Stopping upload.");
        return;
      }
  
      // Uploading Data to database
      console.log("Starting database upload...");
      const dbResponse = await axios.post(`${process.env.EXPO_PUBLIC_HOST_URL}/upload`, {
        caption: caption,
        video: uploadVideoUrl,
        userID: user?.id,
        recipe: recipe,
      });
  
      console.log("Database Upload Response:", dbResponse.data);
      ToastAndroid.show("Upload Successful!", ToastAndroid.SHORT);
    } catch (error) {
      console.error("Upload Error:", error);
      ToastAndroid.show("Upload Failed. Check console.", ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}> Caption </Text>
      {/* Caption Input */}
      <TextInput
        placeholder="Write your description here..."
        value={caption}
        onChangeText={setCaption}
        multiline
        maxLength={2000}
        style={styles.CaptionInput}
      />

      <Text style={styles.heading}> Recipe </Text>
      {/* Recipe Input */}
      <TextInput
        placeholder={`Ingredients:\n\n1 slice of bread\n1 tsp butter\n1 garlic clove\nA pinch of salt\n\nInstructions:\n\nToast the bread until golden.\nSpread butter while it's warm.\nRub the garlic clove over the surface.\nSprinkle a pinch of salt and serve.`}
        value={recipe}
        onChangeText={setRecipe}
        multiline
        maxLength={5000}
        style={styles.RecipeInput}
      />

      {/* Upload Button */}
      <TouchableOpacity onPress={handleUpload} style={styles.uploadButton}>
        <Text style={styles.uploadText}>Post</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  heading: {
    alignSelf: 'flex-start', // Align to the left
    marginLeft: '5%', // Ensure it aligns with inputs
    fontWeight: 'bold', // Make it bold
    fontSize: 16,
    marginBottom: 5, // Add space below heading
    marginTop: 15, // Add space above heading
  },
  CaptionInput: {
    width: '90%',
    height: 60,
    borderWidth: 1,
    borderColor: '#CCC',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    textAlignVertical: 'top',
    elevation: 10,
  },

  RecipeInput: {
    width: '90%',
    height: 240,
    borderWidth: 1,
    borderColor: '#CCC',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    textAlignVertical: 'top',
    elevation: 10,
  },

  uploadButton: {
    marginTop: 20,
    padding: 10,
    borderRadius: 15,
    width: 120,
    backgroundColor: Colors.NavyBlueDark,
    alignItems: 'center',
  },
  uploadText: {
    color: 'white',
    fontSize: 16,
  },
});
