import { AuthContext } from "@/context/AuthContext";
import { Stack } from "expo-router";
import { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

interface USER{
  id:number,
  name:string,
  email:string,
  image:string
}

export default function RootLayout() {
  const [user, setUser] = useState<USER | undefined>(undefined);
  return (

    <AuthContext.Provider value={{user, setUser}}>
    <GestureHandlerRootView>
    <Stack>

      <Stack.Screen name="landing"  
        options={{
        headerShown: false
      }}
      />

      <Stack.Screen name="(auth)/SignUp"
        options={{
        headerTransparent: true,
        headerTitle: '',

      }}
      />

      <Stack.Screen name="(auth)/SignIn"
        options={{
        headerTransparent: true,
        headerTitle: '',

      }}
      />

      <Stack.Screen name="(tabs)"
        options={{
        headerShown: false

      }}

      />

      <Stack.Screen name="Upload/UploadVideo"
        options={{

        headerTitle: 'Create New Post'

      }}
      />

      <Stack.Screen name="ProfileComponents/UserProfile"
          options={{

          headerTitle: ''

          }}
      />
      


    </Stack>
    </GestureHandlerRootView>
    </AuthContext.Provider>
    

  )
}