import { View, Text, Image } from 'react-native'
import React, { useContext } from 'react'
import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { AuthContext } from '@/context/AuthContext';
import Colors from '@/Data/Colors';


export default function TabLayout() {

    const {user}=useContext(AuthContext)

  return (
    
    <Tabs
    screenOptions={{
        tabBarActiveTintColor:Colors.NavyBlueDark,
        tabBarInactiveTintColor:'#000000',
        headerShown:false,
        tabBarShowLabel:false,
        tabBarStyle:{
            height:40,
        }
    }}
    >

        


        <Tabs.Screen name="Home" 
        
        options={{
            
            tabBarIcon:({color,size})=> <Ionicons name="home-sharp" size={size} color={color}
            
            />
        }}
        
        />


        <Tabs.Screen name="Reels" 
        
        options={{
            tabBarIcon:({color,size})=> <Ionicons name="play" size={size} color={color} />
        }}

        />  
        <Tabs.Screen name="Camera" 
        
        options={{
            tabBarIcon:({color,size})=> <Ionicons name="camera" size={size} color={color} />
        }}
        
        />
        <Tabs.Screen name="Recipes" 
        
        options={{
            tabBarIcon:({color,size})=> <MaterialIcons name="food-bank" size={size} color={color} />
        }}
        
        />
        <Tabs.Screen name="Profile" 
        
        options={{
            tabBarIcon:({color,size})=> <Image source={{uri:user?.image}} 

            style={{width:size,height:size,borderRadius:99}}

            />
        }}
        
        />
    </Tabs>

    
    
  )
}