import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

export default function RecipeLibrary() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recipe Library</Text>
      <Text style={styles.text}>Here you'll see your saved recipes</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10
  },
  text: {
    fontSize: 16,
    color: '#555'
  }
});