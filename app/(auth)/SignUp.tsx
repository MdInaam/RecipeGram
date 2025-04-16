import { View, Text, Image, TouchableOpacity, StyleSheet, ToastAndroid, ActivityIndicator } from 'react-native';
import React, { useContext, useState } from 'react';
import TextInputField from '@/components/Shared/TextInputField';
import Button from '@/components/Shared/Button';
import Colors from '../../Data/Colors';
import * as ImagePicker from 'expo-image-picker';
import { create } from 'react-test-renderer';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/configs/FirebaseConfig';
import { upload } from 'cloudinary-react-native';
import { cld, options } from '@/configs/CloudinaryConfig';
import axios from 'axios';
import { router, useRouter } from 'expo-router';
import { AuthContext } from '@/context/AuthContext';

export default function SignUp() {
  const [profilePicture, setProfilePicture] = useState<string | undefined>();
  const [username, setUsername] = useState<string | undefined>();
  const [email, setEmail] = useState<string | undefined>();
  const [password, setPassword] = useState<string | undefined>();
  const router = useRouter();
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const onBtnPress = () => {
    if (!username || !email || !password || !profilePicture) {
      ToastAndroid.show('Please fill all fields!', ToastAndroid.SHORT);
      return;
    }

    setLoading(true);
    // Firebase Authentication
    createUserWithEmailAndPassword(auth, email, password)
      .then(async(userCredentials)=>{
        console.log(userCredentials);
        //Upload Profile Image

        await upload(cld,{
          file:profilePicture,
          options:options,
          callback:async(error:any,response:any)=>{
            if(error){
              console.log(error)
            }
            if(response){
              console.log(response?.url)
              // Once in production
              const result=await axios.post(process.env.EXPO_PUBLIC_HOST_URL+"/user",{
                name:username,
                email:email,
                image:response?.url

              }) 
              setUser({
                name:username,
                email:email,
                image:response?.url
              })

              //Route to homescreen
              router.push('/landing')

          }
        }
      })

        
        
    }).catch((error)=>{
    const errorMsg=error?.message  
    ToastAndroid.show(errorMsg, ToastAndroid.SHORT);
    })
    setLoading(false);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setProfilePicture(result.assets[0].uri);
    }
  };

  return (
    <View style={{ paddingTop: 60, padding: 20 }}>
      <Text style={{ fontSize: 30, fontWeight: 'bold' }}>SignUp</Text>

      <View style={{ display:'flex', alignItems: 'center', marginTop: 20 }}>
        <TouchableOpacity onPress={pickImage}>
          {profilePicture ? (
            <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
          ) : (
            <Image source={require('../../assets/images/pfp.png')} style={styles.profilePicture} />
          )}
          {/* Camera Icon */}
          <Image
            source={require('../../assets/images/pen.png')}
            style={{
              width: 25,
              height: 25,
              position: 'absolute',
              bottom: 2,
              right: -5,
            }}
          />
        </TouchableOpacity>
      </View>

      <TextInputField label="Username" onChangeText={(v) => setUsername(v)} />
      <TextInputField label="Email" onChangeText={(v) => setEmail(v)} />
      <TextInputField label="Password" password={true} onChangeText={(v) => setPassword(v)} />

      <TouchableOpacity
        onPress={onBtnPress}
        style={{
          padding: 10,
          borderRadius: 15,
          width: 150,
          alignSelf: 'center',
          backgroundColor: Colors.NavyBlueDark,
          marginTop: 20,
        }}
      >

                {loading ? (
            <ActivityIndicator color='white' />
          ) : (
            <Text
              style={{
                textAlign: 'center',
                color: 'white',
                fontSize: 15,
                fontWeight: 'bold',
              }}
            >
              Sign Up
            </Text>
          )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 99,
  },
});