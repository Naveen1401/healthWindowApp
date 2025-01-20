import { SafeAreaView, Text } from 'react-native'
import React from 'react'

const Profile = () => {
  return (
    <SafeAreaView className='h-full flex justify-center items-center'
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text className="font-bold">Hi, you sick motherfucking bastard</Text>
    </SafeAreaView>
  )
}

export default Profile