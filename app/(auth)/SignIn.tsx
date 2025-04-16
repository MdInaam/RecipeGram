import { View, Text, TouchableOpacity, ToastAndroid, ActivityIndicator } from 'react-native'
import React, { useContext, useState } from 'react';
import TextInputField from '@/components/Shared/TextInputField'
import Colors from '../../Data/Colors';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/configs/FirebaseConfig';
import axios from 'axios';
import { AuthContext } from '@/context/AuthContext';

export default function SignIn() {

  const [email, setEmail] = useState<string | undefined>('');
  const [password, setPassword] = useState<string | undefined>('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const {user, setUser}=useContext(AuthContext);

  const onSIBtnPress = () => {
    if (!email || !password) {
      ToastAndroid.show('Please fill all fields!', ToastAndroid.SHORT);
      return;
    }

    setLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(async(resp) => {
        if (resp.user) {
          console.log(resp.user?.email)

          // APi Call to fetch user data

          const result=await axios.get(process.env.EXPO_PUBLIC_HOST_URL+"/user?email="+resp.user?.email)
          console.log(result.data);
          setUser(result.data);

          // Save to context to share across the app



        }
        setLoading(false);
        router.replace('/(tabs)/Home')
      }).catch(e=>{
        setLoading(false);
        ToastAndroid.show("Incorrect Email or Password", ToastAndroid.SHORT)
      })
    
  };


  return (
    <View style={{
      padding: 20,
      paddingTop: 150,
      
     }}>


      <Text style={{
        fontSize: 30,
        fontWeight: 'bold',
        alignSelf: 'center'
      }}>Sign In</Text>

      <View style={{
        padding: 0,
        paddingTop: 100,
        
        
      }}
      >

      <TextInputField label="Email" onChangeText={(v) => setEmail(v)} />
      <TextInputField label="Password" password={true} onChangeText={(v) => setPassword(v)} />
      </View>

                <TouchableOpacity
            onPress={onSIBtnPress}
            style={{
              padding: 10,
              borderRadius: 15,
              width: 130,
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
                Login
              </Text>
            )}
          </TouchableOpacity>



    </View>
  )
}