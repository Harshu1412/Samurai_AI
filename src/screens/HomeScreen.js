import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Features from './features';
import { dummyMessages } from '../constants';
import FastImage from 'react-native-fast-image';
import Voice from '@react-native-voice/voice';
import { apiCall } from '../api/openAI';
import Tts from 'react-native-tts';


const HomeScreen = () => {
  const [messages,setMessages]=useState([]);
  const [recording,setRecording] =useState(false)
  const[speaking,setSpeaking]=useState(false)
  const [result,setResult]=useState('')
  const [loading,setLoading]=useState(false);

  const ScrollViewRef=useRef()
  const speechStartHandler=(e)=>{
    console.log("speechStart")
  }
  const speechEndHandler=(e)=>{
    setRecording(false)
    console.log("speechend >>>>>>>>>>>>",e)
  }
  const speechResultsHandler=(e)=>{
    const text=e.value[0];

    setResult(text);
    console.log("speechresult....................",text)
    fetchResponse();
  }
  const speechErrorHandler=(e)=>{
    console.log("speecherror",e)
  }
  const clear=()=>{
    setMessages([])
    Tts.stop();

    
  }
  const stopSpeaking=()=>{
    Tts.stop();
    setSpeaking(false)
  
  }
  const startRecording=async()=>{
    setRecording(true)
    Tts.stop();
    setSpeaking(false)


    try{
      await Voice.start('en-GB')
    }catch(error){
      console.log(error)

    }
  }
  const stopRecording=async()=>{
    try{
      await Voice.stop()
      setRecording(false)
      console.log("harshuuuu")
      fetchResponse();

    }catch(error){
      console.log(error)

    }}
    const fetchResponse=()=>{
      if(result.trim().length>0){
        let newMessages=[...messages];
        newMessages.push({role:'user', content: result.trim()})
        setMessages([...newMessages]);
        updateScrollView();
        setLoading(true)
        apiCall(result.trim(),newMessages).then(res=>{
          console.log("got api data", res); 
          setLoading(false)
          if(res.success){
            setMessages([...res.data]);
            updateScrollView();
            setResult('');
            startTextTospeech(res.data[res.data.length-1]);
          }
          else{
            Alert.alert('Error',res.msg)
          }
        })
      }
    }
    
    const startTextTospeech=message=>{
      console.log("hahahah")
      if(!message.content.includes('https')){
        setSpeaking(true)
        Tts.speak(message.content, {
          androidParams: {
            KEY_PARAM_PAN: -1,
            KEY_PARAM_VOLUME: 0.5,
            KEY_PARAM_STREAM: 'STREAM_MUSIC',
          },
        });

    }}
    const updateScrollView=()=>{
      setTimeout(()=>{
        ScrollViewRef?.current?.scrollToEnd({animated:true})
      },200)
    }
    useEffect(() => {
      // Trigger API call when the result is updated
      if (result.trim().length > 0 && recording === false) {
        fetchResponse();
      }
    }, [result]);
  
  useEffect(()=>{
    //voice handlers
    Voice.onSpeechStart=speechStartHandler;
    Voice.onSpeechEnd=speechEndHandler;
    Voice.onSpeechResults=speechResultsHandler;
    Voice.onSpeechError=speechErrorHandler;

    //tts handlers
    Tts.addEventListener('tts-start', (event) => console.log("start", event));
Tts.addEventListener('tts-progress', (event) => console.log("progress", event));
Tts.addEventListener('tts-finish', (event) => {console.log("finish", event); setSpeaking(false)});
Tts.addEventListener('tts-cancel', (event) => console.log("cancel", event));

    return()=>{
      Voice.destroy().then(Voice.removeAllListeners);
    }
  },[])
  console.log(result)
    return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1 flex mx-5">
        {/* bot icon */}
        <View className="flex-row justify-center">
          <Image style={{height:hp(15),width:hp(15)}} source={require('../../assets/images/bot.png')}/>
        </View>

        {/*features || messages */}

        {
          messages.length>0?(
            
            <View className="space-y-2 flex-1">
              <Text style={{fontSize:wp(5)}} className="text-gray-700 font-semibold ml-1"> Assistant</Text>
              <View style={{height:hp(58)}} className="bg-neutral-200 rounded-3xl p-4">
              <ScrollView
              ref={ScrollViewRef}
              bounces={false} className="space-y-4" showsVerticalScrollIndicator={false}>
                {
                  messages.map((message,index)=>{
                    console.log("Message at index", index, message);

                    if(message.role=='assistant'){
                      if(message.content.includes('https')){
                        //its ai image
                        return(
                        <View key={index} className="flex-row justify-start">
                          <View className="p-2 flex rounded-2xl bg-emerald-100 rounded-tl-none">
                            <Image source={{uri:message.content}}  style={{height:wp(60),width:wp(60)}} resizeMode='cover' className="rounded-2xl"/>
                          </View>
                        </View>
                        )

                      } else{
                        //text
                        return (
                              <View key={index} style={{width:wp(70)}} className="bg-emerald-100 rounded-xl p-2 rounded-tl-none">
                                <Text style={{color:"black"}}>{message.content}</Text>
                              </View>

                        )
                      }
                     
                    }else{
                      //userInput
                      return(
                        <View key={index} className="flex-row justify-end">
                          <View style={{width:wp(70)}} className="bg-white rounded-xl p-2 rounded-tr-none">
                            <Text style={{color:"black"}}>{message.content}</Text>
                          </View>
                        </View>
                      )
                    }
                    // return(
                    //  <View>
                    //   <Text>{message.content}</Text>
                    //  </View>
                    // )
                  })
                }
              </ScrollView>
              </View>
            </View>
          ):(             <Features/>
          )
          
        }
        {/* */}
        <View className="flex justify-center items-center">
          {
            loading?(
                <FastImage source={require("../../assets/images/loading.gif")}
                
                style={{width:hp(10),height:hp(10)}}/>
            ):
            recording?(
              <TouchableOpacity onPress={stopRecording}>
                <FastImage
                className="rounded-full"
                source={require("../../assets/images/voiceLoading.gif")}
                style={{height:hp(10),width:hp(10)}}
                />

              </TouchableOpacity>

            ):(
              <TouchableOpacity onPress={startRecording}>
                 <Image
                className="rounded-full"
                source={require("../../assets/images/recordingIcon.png")}
                style={{height:hp(10),width:hp(10)}}
                />

              </TouchableOpacity>
            )
          }
          {messages.length>0 &&(
            <TouchableOpacity
            onPress={clear}
            className="bg-neutral-400 rounded-3xl p-2 absolute right-10"
            >
              <Text className="text-white font-semibold" >Clear</Text>
            </TouchableOpacity>
          )}
          {speaking &&(
            <TouchableOpacity
            onPress={stopSpeaking}
            className="bg-red-400 rounded-3xl p-2 absolute left-10"
            >
              <Text className="text-white font-semibold" >Stop</Text>
            </TouchableOpacity>
          )}
         
        </View>
      </SafeAreaView>
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({})