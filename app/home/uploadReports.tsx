import { Text,SafeAreaView, StyleSheet, View, Button} from 'react-native'
import React from 'react'
import UploadReport from '@/components/UploadReport'
import AllReports from '@/components/AllReports'
import GlobalStyleSheet from '../globalStyle'
import { router } from 'expo-router'

const UploadReports = () => {
  return (
    <SafeAreaView style={style.uploadRportsMainContainer}>
      <Text style= {GlobalStyleSheet.mainHeading}>Upload Reports</Text>
      <View style={{ height: '40%'}}><UploadReport/></View>
      <View style={{height: '100%'}}>
        <AllReports length={6} title='Recent Reports :'/>
        <Button
          title="load more ..."
          onPress={() => {
            router.push('/home/myReports')
          }}
        />
      </View>
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  uploadRportsMainContainer : {
    backgroundColor: "#dce6fc",
    height:"100%"
  }
});

export default UploadReports