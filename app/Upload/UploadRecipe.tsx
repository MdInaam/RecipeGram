import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
  Alert,
  Platform,
  FlatList,
  LayoutAnimation,
  UIManager,
  Keyboard,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from '@expo/vector-icons/Ionicons';
import { MotiView, useAnimationState } from 'moti';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// App color palette
const Colors = {
  NavyBlueDark: '#003366',
  Grey: '#808080',
  LightGrey: '#d3d3d3',
  DisabledGrey: '#BDBDBD',
  White: '#ffffff',
  Black: '#000000',
  Red: '#D32F2F',
  BorderGrey: '#cccccc',
  FocusedBorder: '#003366',
};

// Type definitions
interface IngredientRow {
  id: string;
  name: string;
  quantity: string;
  unit: string;
}

interface RecipeData {
  thumbnailUri: string | null;
  recipeName: string;
  servings: string;
  ingredients: IngredientRow[];
  instructions: string;
}

// --- Constants for Validation ---
const RECIPE_NAME_MAX_LENGTH = 55;
const RECIPE_NAME_COUNTER_THRESHOLD = 40;
const INSTRUCTIONS_MAX_LENGTH = 10000;
const INSTRUCTIONS_COUNTER_THRESHOLD = 9900; // Show counter earlier if desired
const RECIPE_NAME_INVALID_REGEX = /[^a-zA-Z0-9\s-']/g; // Matches disallowed characters
const SERVINGS_VALID_REGEX = /^[1-9]\d*$/; // Matches positive whole numbers

export default function UploadRecipe() {
  const router = useRouter();
  const { videoUri, caption } = useLocalSearchParams<{ videoUri: string; caption: string }>();

  // Recipe data state
  const [thumbnailUri, setThumbnailUri] = useState<string | null>(null);
  const [recipeName, setRecipeName] = useState<string>('');
  const [servings, setServings] = useState<string>('');
  const [ingredients, setIngredients] = useState<IngredientRow[]>([]);
  const [instructions, setInstructions] = useState<string>('');

  // Input focus state - tracks which input is currently focused
  const [focusedField, setFocusedField] = useState<string | null>(null);

   // New State for Validation & UI Feedback
   const [recipeNameError, setRecipeNameError] = useState<string | null>(null);

   // --- Animation States ---
   const recipeNameShakeState = useAnimationState({
     idle: { translateX: 0 },
     shake: { translateX: [-5, 5, -5, 5, 0] }, // Simple shake sequence
   });
   const instructionsShakeState = useAnimationState({
     idle: { translateX: 0 },
     shake: { translateX: [-5, 5, -5, 5, 0] },
   });

     // --- Input Change Handlers with Validation ---

  const handleRecipeNameChange = (text: string) => {
    // 1. Check Length
    if (text.length > RECIPE_NAME_MAX_LENGTH) {
      // Trigger shake animation
      recipeNameShakeState.transitionTo('shake');
      // Reset to idle after animation
      setTimeout(() => recipeNameShakeState.transitionTo('idle'), 200);
      return; // Don't update state if exceeds max length
    }

    // 2. Check for invalid characters
    if (RECIPE_NAME_INVALID_REGEX.test(text)) {
      setRecipeNameError("Invalid characters. Use only letters, numbers, spaces, -, '");
    } else {
      setRecipeNameError(null); // Clear error if valid
    }

    // 3. Update state
    setRecipeName(text);
  };

  const handleServingsChange = (text: string) => {
     // Allow empty input for easy clearing
     if (text === '') {
       setServings('');
       return;
     }
    // Allow only positive whole numbers & prevent leading zeros for multi-digit numbers
    if (SERVINGS_VALID_REGEX.test(text)) {
        // Optional: Add a reasonable max length for servings (e.g., 3 digits)
        if (text.length <= 3) {
             setServings(text);
        }
    }
    // Otherwise, do nothing - prevent invalid input
  };

  const handleInstructionsChange = (text: string) => {
      // 1. Check Length
      if (text.length > INSTRUCTIONS_MAX_LENGTH) {
          // Trigger shake animation
          instructionsShakeState.transitionTo('shake');
          // Reset to idle after animation
          setTimeout(() => instructionsShakeState.transitionTo('idle'), 200);
          return; // Don't update state
      }
      // 2. Update state (no character validation needed)
      setInstructions(text);
  };


  // Add a new empty ingredient row
  const addIngredientRow = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIngredients([
      ...ingredients,
      { id: Date.now().toString(), name: '', quantity: '', unit: '' },
    ]);
  };

  // Update a specific field in an ingredient row
  const updateIngredient = (id: string, field: keyof IngredientRow, value: string) => {
    setIngredients(
      ingredients.map(ing => (ing.id === id ? { ...ing, [field]: value } : ing))
    );
  };

  // Remove an ingredient row with animation
  const removeIngredientRow = (id: string) => {
    setIngredients(ingredients.filter(ing => ing.id !== id));
  };

  // Open image picker to select recipe thumbnail
  const pickThumbnail = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant permission to access photos to select a thumbnail.');
      return;
    }
    
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setThumbnailUri(result.assets[0].uri);
    }
  };

  // Validate and navigate to recipe preview
  const handlePreview = () => {
    // Add validation check for recipe name error before proceeding
    if (recipeNameError) {
      Alert.alert("Invalid Input", "Please fix the errors in the recipe name.");
      return;
    }

    if (!recipeName.trim()) { 
      Alert.alert("Missing Info", "Please enter a recipe name."); 
      return; 
    }
    
    if (ingredients.length === 0 || ingredients.every(i => !i.name.trim() && !i.quantity.trim() && !i.unit.trim())) { 
      Alert.alert("Missing Info", "Please add at least one ingredient."); 
      return; 
    }
    
    if (!instructions.trim()) { 
      Alert.alert("Missing Info", "Please add cooking instructions."); 
      return; 
    }

    const currentRecipeData: RecipeData = {
      thumbnailUri,
      recipeName: recipeName.trim(),
      servings: servings.trim(),
      ingredients: ingredients.filter(ing => ing.name.trim() || ing.quantity.trim() || ing.unit.trim()),
      instructions: instructions.trim(),
    };
    
    router.push({
      pathname: '/Upload/UploadPreview',
      params: { videoUri, caption, recipeData: JSON.stringify(currentRecipeData) },
    });
  };

  // Navigate back
  const handleBack = () => {
    if (router.canGoBack()) { 
      router.back(); 
    } else { 
      router.replace('/(tabs)/Home'); 
    }
  };

  // FlatList header component showing title and main recipe info fields
  const renderListHeader = () => (
    <View style={styles.listHeaderFooterContainer}>
      <Text style={styles.pageTitle}>Create Recipe</Text>
      
      {/* Thumbnail picker and recipe details section */}
      <View style={styles.topSection}>
        <TouchableOpacity onPress={pickThumbnail} style={styles.thumbnailPicker}>
          {thumbnailUri ? (
            <Image source={{ uri: thumbnailUri }} style={styles.thumbnailImage} resizeMode="cover" />
          ) : (
            <View style={styles.thumbnailPlaceholder}>
              <Ionicons name="camera-outline" size={30} color={Colors.Grey} />
              <Text style={styles.thumbnailPlaceholderText}>Add Cover</Text>
            </View>
          )}
        </TouchableOpacity>
        
        <View style={styles.nameServingsContainer}>
           {/* Recipe Name Input + Counter/Error */}
           <View style={styles.inputContainer}>
             <MotiView state={recipeNameShakeState} transition={{ type: 'timing', duration: 50 }}>
                 <TextInput
                   style={[
                     styles.inputUnderlined,
                     styles.recipeNameInput,
                     { borderBottomColor: focusedField === 'recipeName' ? Colors.FocusedBorder : Colors.BorderGrey },
                     recipeNameError ? styles.inputErrorBorder : null // Add error border style
                   ]}
                   placeholder="Recipe Name"
                   value={recipeName}
                   onChangeText={handleRecipeNameChange} // Use new handler
                   placeholderTextColor={Colors.Grey}
                   onFocus={() => setFocusedField('recipeName')}
                   onBlur={() => setFocusedField(null)}
                   maxLength={RECIPE_NAME_MAX_LENGTH} // Enforce max length
                 />
             </MotiView>
             <View style={styles.inputFooter}>
                 {/* Error Message */}
                 {recipeNameError && <Text style={styles.errorMessage}>{recipeNameError}</Text>}
                 {/* Character Counter */}
                 {recipeName.length >= RECIPE_NAME_COUNTER_THRESHOLD && (
                   <Text style={[styles.charCounter, recipeName.length === RECIPE_NAME_MAX_LENGTH ? styles.charCounterLimit : null]}>
                     {recipeName.length}/{RECIPE_NAME_MAX_LENGTH}
                   </Text>
                 )}
             </View>
           </View>

           {/* Servings Input */}
           <View style={styles.inputContainer}>
             <TextInput
               style={[
                 styles.inputUnderlined,
                 styles.servingsInput, // Apply specific width style here
                 { borderBottomColor: focusedField === 'servings' ? Colors.FocusedBorder : Colors.BorderGrey }
               ]}
               placeholder="Servings" // Simpler placeholder
               value={servings}
               onChangeText={handleServingsChange} // Use new handler
               keyboardType="number-pad"
               placeholderTextColor={Colors.Grey}
               onFocus={() => setFocusedField('servings')}
               onBlur={() => setFocusedField(null)}
               maxLength={3} // Optional: Set max length for servings
             />
             {/* No counter/error needed here per requirements */}
           </View>
        </View>
      </View>
      {/* Ingredients Title */}
      <View style={styles.ingredientsTitleContainer}>
          <Text style={styles.sectionTitle}>Ingredients</Text>
      </View>
    </View>
  );

  // FlatList footer component showing the add ingredient button and instructions
  const renderListFooter = () => (
    <View style={styles.listHeaderFooterContainer}>
      {/* Add ingredient button */}
      <TouchableOpacity onPress={addIngredientRow} style={styles.addIngredientButton}>
        <Ionicons name="add-circle-outline" size={24} color={Colors.NavyBlueDark} />
        <Text style={styles.addIngredientText}>Add Ingredient</Text>
      </TouchableOpacity>

      {/* Instructions input section */}
      <View style={styles.instructionsSectionContainer}>
        <Text style={styles.sectionTitle}>Instructions</Text>
         {/* Instructions Input + Counter */}
         <View style={styles.inputContainer}>
             <MotiView state={instructionsShakeState} transition={{ type: 'timing', duration: 50 }}>
                 <TextInput
                   style={[
                     styles.inputUnderlined,
                     styles.instructionsInput,
                     { borderBottomColor: focusedField === 'instructions' ? Colors.FocusedBorder : Colors.BorderGrey }
                   ]}
                   placeholder="Add step-by-step instructions..."
                   value={instructions}
                   onChangeText={handleInstructionsChange} // Use new handler
                   multiline
                   textAlignVertical="top"
                   placeholderTextColor={Colors.Grey}
                   onFocus={() => setFocusedField('instructions')}
                   onBlur={() => setFocusedField(null)}
                   maxLength={INSTRUCTIONS_MAX_LENGTH} // Enforce max length
                 />
            </MotiView>
            <View style={styles.inputFooter}>
                 {/* Character Counter */}
                 {instructions.length >= INSTRUCTIONS_COUNTER_THRESHOLD && (
                   <Text style={[styles.charCounter, instructions.length === INSTRUCTIONS_MAX_LENGTH ? styles.charCounterLimit : null]}>
                     {instructions.length}/{INSTRUCTIONS_MAX_LENGTH}
                   </Text>
                 )}
             </View>
         </View>
      </View>
    </View>
  );

  // Render each ingredient row with animation
  const renderIngredientItem = ({ item, index }: { item: IngredientRow, index: number }) => (
    <MotiView
      from={{ opacity: 0, translateY: -10 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: -10, height: 0, marginBottom: 0, paddingBottom: 0 }}
      transition={{ type: 'timing', duration: 300 }}
      style={styles.ingredientRowContainer}
    >
      <View style={styles.ingredientRowContent}>
        <Text style={styles.ingredientNumber}>{index + 1}.</Text>
        <TextInput
          style={[styles.ingredientInput, styles.ingredientNameInput]}
          placeholder="Ingredient Name"
          value={item.name}
          onChangeText={(text) => updateIngredient(item.id, 'name', text)}
          placeholderTextColor={Colors.Grey}
        />
        <TextInput
          style={[styles.ingredientInput, styles.ingredientQuantityInput]}
          placeholder="Qty"
          value={item.quantity}
          onChangeText={(text) => updateIngredient(item.id, 'quantity', text)}
          placeholderTextColor={Colors.Grey}
          keyboardType="default"
        />
        <TextInput
          style={[styles.ingredientInput, styles.ingredientUnitInput]}
          placeholder="Unit"
          value={item.unit}
          onChangeText={(text) => updateIngredient(item.id, 'unit', text)}
          placeholderTextColor={Colors.Grey}
        />
        <TouchableOpacity onPress={() => removeIngredientRow(item.id)} style={styles.deleteIngredientButton}>
          <Ionicons name="close-circle-outline" size={22} color={Colors.Red} />
        </TouchableOpacity>
      </View>
    </MotiView>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Main content with scrollable list of ingredients */}
      <FlatList
        data={ingredients}
        renderItem={renderIngredientItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderListHeader}
        ListFooterComponent={renderListFooter}
        contentContainerStyle={styles.listContentContainer}
        keyboardShouldPersistTaps="handled"
        ListFooterComponentStyle={{ paddingBottom: 30 }}
      />

      {/* Bottom navigation buttons */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={[styles.bottomButton, styles.backButton]} onPress={handleBack}>
          <Text style={[styles.bottomButtonText, styles.backButtonText]}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.bottomButton, styles.previewButton]} onPress={handlePreview}>
          <Text style={[styles.bottomButtonText, styles.previewButtonText]}>Preview</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  listContentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100, // Space above bottom bar
  },
  listHeaderFooterContainer: {
    // Container for header/footer content sections
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 25,
    textAlign: 'center',
    color: Colors.Black,
  },
  // Top section styling
  topSection: { 
    flexDirection: 'row', 
    marginBottom: 30, 
    alignItems: 'center' 
  },
  thumbnailPicker: { 
    width: 100, 
    height: 100, 
    borderRadius: 10, 
    backgroundColor: '#f0f0f0', 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15, 
    overflow: 'hidden', 
    borderWidth: 1, 
    borderColor: Colors.BorderGrey 
  },
  thumbnailImage: { 
    width: '100%', 
    height: '100%' 
  },
  thumbnailPlaceholder: { 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  thumbnailPlaceholderText: { 
    fontSize: 12, 
    color: Colors.Grey, 
    marginTop: 4 
  },
  nameServingsContainer: { 
    flex: 1, 
    justifyContent: 'flex-start', 
    height: 100 
  },
  inputContainer: {
    marginBottom: 10, // Add space below each input group
  },
  inputErrorBorder: {
    borderBottomColor: Colors.Red,
},
recipeNameInput: {
    // Now takes full width within its container
},
servingsInput: {
    maxWidth: 100, // Limit width for servings input (Point 2)
    // width: 80, // Alternative: use fixed width
},

// Footer below inputs (for error/counter)
inputFooter: {
    flexDirection: 'row', // Arrange error and counter side-by-side if both visible
    justifyContent: 'space-between', // Push error left, counter right
    marginTop: 4, // Space between underline and footer text
    minHeight: 18, // Reserve space even when empty to prevent layout jumps
},
errorMessage: {
    fontSize: 12,
    color: Colors.Red,
    flexShrink: 1, // Allow error message to wrap if needed
    marginRight: 10, // Space between error and counter
},
charCounter: {
    fontSize: 12,
    color: Colors.Red, // Counter is red when shown
},
charCounterLimit: { // Optional: slightly bolder when limit is reached
    fontWeight: 'bold',
},


  // Base underlined input style
  inputUnderlined: {
    width: '100%',
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.BorderGrey,
    paddingHorizontal: 2,
    paddingVertical: 10,
    fontSize: 16,
    color: Colors.Black,
  },

  // Section headers
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '600', 
    marginBottom: 15, 
    color: Colors.Black 
  },
  ingredientsTitleContainer: {
    marginBottom: 0,
    marginTop: 10,
  },
  instructionsSectionContainer: {
    marginTop: 25,
    marginBottom: 30,
  },

  // Ingredient styling
  ingredientRowContainer: {
    overflow: 'hidden',
  },
  ingredientRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
  },
  ingredientNumber: { 
    marginRight: 8, 
    color: Colors.Grey, 
    width: 20, 
    textAlign: 'right', 
    fontSize: 14 
  },
  ingredientInput: { 
    borderWidth: 1, 
    borderColor: Colors.BorderGrey, 
    borderRadius: 6, 
    paddingHorizontal: 10, 
    paddingVertical: 8, 
    fontSize: 14, 
    marginRight: 8, 
    backgroundColor: Colors.White, 
    color: Colors.Black 
  },
  ingredientNameInput: { 
    flex: 3, 
    minWidth: 100 
  },
  ingredientQuantityInput: { 
    flex: 1, 
    minWidth: 60, 
    textAlign: 'center' 
  },
  ingredientUnitInput: { 
    flex: 1.5, 
    minWidth: 70 
  },
  deleteIngredientButton: { 
    paddingLeft: 8 
  },
  addIngredientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    alignSelf: 'flex-start',
  },
  addIngredientText: { 
    marginLeft: 8, 
    fontSize: 16, 
    color: Colors.NavyBlueDark, 
    fontWeight: '500' 
  },

  // Instructions styling
  instructionsInput: {
    minHeight: 50,
    textAlignVertical: 'top',
  },

  // Bottom bar styling
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    paddingBottom: Platform.OS === 'ios' ? 30 : 15,
    backgroundColor: Colors.White,
  },
  bottomButton: { 
    flex: 1, 
    marginHorizontal: 8, 
    paddingVertical: 12, 
    borderRadius: 25, 
    alignItems: 'center' 
  },
  backButton: { 
    backgroundColor: Colors.LightGrey 
  },
  previewButton: { 
    backgroundColor: Colors.Black 
  },
  bottomButtonText: { 
    fontSize: 16, 
    fontWeight: '600' 
  },
  backButtonText: { 
    color: Colors.Black 
  },
  previewButtonText: { 
    color: Colors.White 
  },
});