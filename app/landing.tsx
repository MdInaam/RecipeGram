import { View, Text, Pressable } from 'react-native'
import React from 'react'
import Colors from '../Data/Colors';
import Button from '@/components/Shared/Button';
import { useRouter } from 'expo-router';

export default function LandingScreen() {
    const router = useRouter();
  return (
    <View>



    <Button text='Get Started' 
    onPress={() => router.push('/(auth)/SignUp')}/>



<View style={{ 
  marginTop: 10,
  alignSelf: 'center',
  flexDirection: 'row',
}}>
  <Text style={{ color: 'black' }}>
    Already have an account?{' '}
  </Text>
  <Pressable onPress={() => router.push('/(auth)/SignIn')}>
    <Text style={{ color: 'gray', textDecorationLine: 'underline' }}>
      Sign in here!
    </Text>
  </Pressable>
</View>



    </View>
  )
}

