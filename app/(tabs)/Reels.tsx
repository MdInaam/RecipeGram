import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Following from '../ReelsComponents/Following';
import ForYou from '../ReelsComponents/ForYou';

export default function Reels() {
  const [selectedTab, setSelectedTab] = useState<'Following' | 'ForYou'>('Following');

  return (
    <View style={styles.container}>
      {/* Floating Top Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => setSelectedTab('Following')}>
          <Text style={[styles.tabText, selectedTab === 'Following' && styles.activeTab]}>
            Following
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedTab('ForYou')}>
          <Text style={[styles.tabText, selectedTab === 'ForYou' && styles.activeTab]}>
            For You
          </Text>
        </TouchableOpacity>
      </View>

      {/* Displaying Video Content */}
      {selectedTab === 'Following' ? <Following /> : <ForYou />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    position: 'absolute',
    top: 10, // Position it below status bar
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 1, // Ensure tabs appear above video
  },
  tabText: {
    fontSize: 18,
    color: 'grey', // Unselected tab color
    marginHorizontal: 15,
    fontWeight: 'bold',
    paddingBottom: 5,
  },
  activeTab: {
    color: 'white', // Selected tab color
    borderBottomWidth: 1,
    borderBottomColor: 'white', // White underline for selected tab
  },
});
