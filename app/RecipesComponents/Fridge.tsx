import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

export default function Fridge() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fridge Tracker</Text>
      <Text style={styles.text}>Track your ingredients and available items here</Text>
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