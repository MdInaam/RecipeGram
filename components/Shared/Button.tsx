import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '../../Data/Colors';

type ButtonProps={
    text: string,
    onPress:()=>void
}

export default function Button({text, onPress}: ButtonProps) {
  return (
   <TouchableOpacity
         onPress={onPress}
            style={{
           padding: 10,
           marginTop: 500,
           borderRadius: 15,
           width: 150,
           alignSelf: 'center',
           backgroundColor: Colors.NavyBlueDark,
       }}>
         <Text style={{
           textAlign: 'center',
           color: 'white',
           fontSize: 15,
           fontWeight: 'bold'
         }} >
           {text}</Text>
       </TouchableOpacity> 
  )
}