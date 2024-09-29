import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

import React from 'react'
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
  const navigation=useNavigation();
  return (
    <SafeAreaView className="flex-1 flex justify-around bg-white">
   <View className="space-y-2">
    <Text className="text-center text-4xl font-bold text-gray-700" style={{fontSize:wp(10)}}>Samurai</Text>
    <Text className="text-center tracking-wide text-gray-600 font-semibold" style={{fontSize:wp(4)}}>
      The Future is here, powered by AI</Text>
   </View>
   <View className="flex-row justify-center">
   <Image source={require('../../assets/images/welcome.png')} style={{width:wp(75),height:wp(75) }}/>
   </View>
   <TouchableOpacity onPress={()=>navigation.navigate("Home")} className="bg-emerald-600 mx-5 p-4 rounded-2xl">
     <Text STYLE={{fontSize:wp(6)}} className="text-center font-bold text-white text-2xl">Get Started</Text>
   </TouchableOpacity>
    </SafeAreaView>
  )
}

export default WelcomeScreen

const styles = StyleSheet.create({})