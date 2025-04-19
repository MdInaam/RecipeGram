import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import RecipeLibrary from '../RecipesComponents/RecipeLibrary';
import ND from '../RecipesComponents/ND';
import Fridge from '../RecipesComponents/Fridge';
import Colors from '@/Data/Colors';

const { width } = Dimensions.get('window');
// Account for the marginHorizontal of the tabContainer (10 on each side)
const TAB_CONTAINER_MARGIN = 10; // marginHorizontal: 10
const EFFECTIVE_WIDTH = width - 2 * TAB_CONTAINER_MARGIN; // Subtract left and right margins
const TAB_WIDTH = EFFECTIVE_WIDTH / 3; // Recalculate TAB_WIDTH based on effective width

export default function Recipes() {
  const [activeTab, setActiveTab] = useState('Library');
  const slideAnim = useRef(new Animated.Value(0)).current;

  const tabs = [
    { key: 'Library', component: <RecipeLibrary /> },
    { key: 'Alimentary', component: <ND /> },
    { key: 'Fridge', component: <Fridge /> },
  ];

  const handleTabPress = (tab: string, index: number) => {
    setActiveTab(tab);
    Animated.spring(slideAnim, {
      toValue: index * TAB_WIDTH, // Use the adjusted TAB_WIDTH
      useNativeDriver: true,
      friction: 8,
      tension: 70,
    }).start();
  };

  const renderTabs = () => {
    return (
      <View style={styles.tabContainer}>
        <Animated.View
          style={[
            styles.slider,
            {
              transform: [{ translateX: slideAnim }],
            },
          ]}
        />
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => handleTabPress(tab.key, index)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key ? styles.activeTabText : null,
              ]}
            >
              {tab.key}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderContent = () => {
    const activeTabData = tabs.find((tab) => tab.key === activeTab);
    return activeTabData ? activeTabData.component : null;
  };

  return (
    <View style={styles.container}>
      {renderTabs()}
      <View style={styles.contentContainer}>{renderContent()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 10,
    marginHorizontal: TAB_CONTAINER_MARGIN, // 10 on each side
    position: 'relative',
    height: 50,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    zIndex: 2,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  slider: {
    position: 'absolute',
    width: TAB_WIDTH,
    height: 36, // Reduced further to 36 for a smaller box (adjust as needed)
    backgroundColor: Colors.NavyBlueDark,
    borderRadius: 10,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    top: 7, // Adjusted to (50 - 36) / 2 to center vertically within the tabContainer (height 50)
  },
  contentContainer: {
    flex: 1,
    padding: 10,
  },
});