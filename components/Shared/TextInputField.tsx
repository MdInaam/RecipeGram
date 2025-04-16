import { View, Text, TextInput, StyleSheet } from 'react-native'
import React from 'react'

type TextInputFieldProps={
    label:string,
    onChangeText:(text:string)=>void,
    password?:boolean
    }

export default function TextInputField({label, onChangeText, password=false}: TextInputFieldProps) {
  return (
    <View>
      <Text style={{
            marginLeft: 62,
            marginTop: 20,
            fontSize: 15,
            fontWeight: 'bold'
      }}>{label}</Text>
      <TextInput placeholder={label} style={styles.textInput} 
      secureTextEntry={password}
      onChangeText={onChangeText}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    textInput: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: 'gray',
        marginTop: 5,
        
        alignSelf: 'center',
        width: 250
        
    }
    
})