import { SafeAreaView } from 'react-native'
import React from 'react'
import UploadReport from '@/components/UploadReport'

const MyReports = () => {
  return (
    <SafeAreaView className='h-full flex justify-center items-center'
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <UploadReport/>
    </SafeAreaView>
  )
}

export default MyReports