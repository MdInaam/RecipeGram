import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';

export default function FooterPNC({ username, profile_image, caption, recipe }: 
  { username: string; profile_image: string; caption: string; recipe: string }) {

  const [isExpanded, setIsExpanded] = useState(false);
  const [textHeight, setTextHeight] = useState(0);

  // Calculate text height dynamically
  const handleTextLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setTextHeight(height);
  };

  return (
    <View style={styles.contentContainer}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity style={styles.profileImageContainer}>
          <Image 
            source={{ uri: profile_image }}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        
        <TouchableOpacity>
          <Text style={styles.profileName}>{username}</Text>
        </TouchableOpacity>
      </View>

      {/* Caption Section */}
      <View 
        style={[
          styles.captionSection, 
          { 
            maxHeight: isExpanded 
              ? Math.min(textHeight, 250)  // Expands dynamically but max 250
              : 40 // Collapsed state
          }
        ]}
      >
        <ScrollView 
          nestedScrollEnabled={true} 
          style={styles.captionScroll}
          scrollEnabled={isExpanded}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity 
            onPress={() => setIsExpanded(!isExpanded)}
            delayPressIn={200} // Helps detect scroll gesture
            activeOpacity={1}
          >
            <Text 
              style={styles.caption} 
              numberOfLines={isExpanded ? undefined : 1} 
              ellipsizeMode="tail"
              onLayout={handleTextLayout} // Measure text height
            >
              {caption}{"\n\n"}{recipe}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    gap: 10,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  profileImageContainer: {
    position: 'relative',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileName: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  captionSection: {
    overflow: 'hidden',
    paddingRight: 40,
  },
  captionScroll: {
    maxHeight: 250, // Ensures scrolling works in expanded mode
  },
  caption: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 18,
  },
});
