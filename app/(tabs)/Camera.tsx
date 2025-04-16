import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router';
import Colors from '@/Data/Colors'
import { getAuth, signOut } from "firebase/auth";

export default function Camera() {

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onUploadBtnPress = async () => {
    setLoading(true);

   router.push('/Upload/UploadVideo') //ProfileComponents/UserProfile ///Upload/UploadVideo

    setLoading(false);
  };


  const onLogOutBtnPress = async () => {
    setLoading(true);
          const auth = getAuth();
      signOut(auth).then(() => {
        // Sign-out successful.
      }).catch((error) => {
        // An error happened.
      });
      


   router.push('/landing')

    setLoading(false);
  };



  return (
    <View>
      <View>
              <TouchableOpacity
                      onPress={onUploadBtnPress}
                      style={{
                        padding: 10,
                        borderRadius: 10,
                        width: 100,
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
                              fontSize: 12,
                              fontWeight: 'bold',
                            }}
                          >
                            Upload
                          </Text>
                          
                        )}
                        </TouchableOpacity>
      
      
      
                        <TouchableOpacity
                      onPress={onLogOutBtnPress}
                      style={{
                        padding: 10,
                        borderRadius: 10,
                        width: 100,
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
                              fontSize: 12,
                              fontWeight: 'bold',
                            }}
                          >
                            Logout
                          </Text>
                          
                        )}
                        </TouchableOpacity>
      
      
      
                        
            </View>
    </View>
  )
}