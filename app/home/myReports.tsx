import { Text,SafeAreaView, StyleSheet} from 'react-native'
import React from 'react'
import UploadReport from '@/components/UploadReport'
import RecentReports from '@/components/RecentReports'
import GlobalStyleSheet from '../globalStyle'

const MyReports = () => {
  return (
    <SafeAreaView style={style.myRportsMainContainer}>
      <Text style= {GlobalStyleSheet.mainHeading}>My Reports</Text>
      <UploadReport/>
      <RecentReports/>
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  myRportsMainContainer : {
    backgroundColor: "#dce6fc",
    height:"100%"
  }
});

export default MyReports