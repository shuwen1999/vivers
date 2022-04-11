import { View, Text, SafeAreaView, TouchableOpacity, Image, TextInput, FlatList, Button, Keyboard, KeyboardAvoidingView,TouchableWithoutFeedback } from 'react-native'
import React, {useState, useEffect} from 'react'
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation, useRoute } from '@react-navigation/native';
import tw  from 'tailwind-rn';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import useAuth from '../hooks/useAuth';
import { Platform } from 'expo-modules-core';
import SenderMessage from '../Components/SenderMessage';
import ReceiverMessage from '../Components/ReceiverMessage';
import {addDoc, collection, doc, onSnapshot, query, orderBy} from "@firebase/firestore";
import {db} from "../firebase"
import { serverTimestamp } from 'firebase/firestore';
import { 
    useFonts,
    OleoScript_400Regular,
    OleoScript_700Bold, 
  } from '@expo-google-fonts/oleo-script'

const MessageScreen = () => {
    const navigation = useNavigation();
    const {user} = useAuth();
    const {params} = useRoute();
    const [input, setInput] = useState("");
    const {friendDetails, oneid} = params;
    let [fontsLoaded] = useFonts({
        OleoScript_400Regular,
        OleoScript_700Bold 
      });
    
    const [messages, setMessages]= useState([]);


    useEffect(()=>
        onSnapshot(
            query(collection(db, 'friends', friendDetails.id, 'messages'), 
            orderBy('timestamp','desc')
            ), snapshot=> setMessages(snapshot.docs.map(doc =>({
                id:doc.id,
                ...doc.data()
            }))
            )
        ),
     [friendDetails, db]);

    const sendMessage =() =>{
        addDoc(collection(db,"friends", friendDetails.id, "messages"),{
            timestamp: serverTimestamp(),
            userId: user.uid,
            displayName: user.displayName,
            photoURL: friendDetails.users[user.uid].ogURL,
            message:input,
        });
        setInput("");
    };
    if(!fontsLoaded){return null;}
    return (
        
        <SafeAreaView style={tw("flex-1")}>
            {/* header bar */}
            <View 
            style={tw('flex-row px-6 py-4 relative top-10 items-center bg-gray-200 justify-center')}
            >
                <TouchableOpacity
                    style={tw("left-4 absolute")}
                    onPress={()=> navigation.goBack()}
                >
                <Ionicons name="chevron-back" size={30} color="black" />
                </TouchableOpacity>
                
                <Text style={[tw("text-lg text-center"),{fontFamily:"OleoScript_400Regular", color:'#7D7D7D'}]}>{getMatchedUserInfo(friendDetails.users, user.uid).displayName}</Text>
                
                <Image
                style={tw("rounded-full h-12 w-12 absolute right-4")}
                source={{uri:getMatchedUserInfo(friendDetails.users, user.uid)?.ogURL}}
                />
                
            </View>

            <View style={tw("items-center")}>
                {oneid?(
                    <View style={tw("flex-row")}>
                        <TouchableOpacity style={[tw("bg-red-500 h-10 mt-12 pt-2 rounded-lg w-6/12 mx-4"),{backgroundColor: "#FD7656"}]} onPress={()=>navigation.navigate("MatchList",{friendDetails})}>
                            <Text style={tw("text-white font-bold text-center")}>Match</Text>
                        </TouchableOpacity>
                        
                            <Text style={tw("text-white font-bold text-center h-10 mt-12 pt-2 rounded-lg w-3/12 bg-gray-400")}>ID: {oneid}</Text>
                        
                    </View>
                ):(
                    <TouchableOpacity style={[tw("bg-red-500 h-10 mt-12 pt-2 rounded-lg w-11/12"),{backgroundColor: "#FD7656"}]} onPress={()=>navigation.navigate("MatchList",{friendDetails})}>
                        <Text style={tw("text-white font-bold text-center")}>Match</Text>
                    </TouchableOpacity>
                )}
            
            </View>
            
            {/* text messages */}
            <KeyboardAvoidingView
            behavior={Platform.OS === "ios"? "padding": "height"}
            style={tw("flex-1")}
            keyboardVerticalOffset={10}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <FlatList
                    data={messages}
                    inverted={-1}
                    style={tw("pl-4")}
                    keyExtractor={item => item.id}
                    renderItem={({item:message})=> 
                        message.userId === user.uid ? (
                            <SenderMessage key={message.id} message={message}/>
                        ):(
                            <ReceiverMessage key={message.id} message={message}/>
                        )
                    }
                    />
                    
                </TouchableWithoutFeedback>

            </KeyboardAvoidingView>
            <View style={[tw("flex-row justify-between items-center px-5 py-2"),{backgroundColor:"#E2E8F0"}]}>
                <TextInput
                style={[tw("text-center h-8 w-64 text-sm rounded-full"),{backgroundColor:"white", color:"#BDBDBD"}]}
                placeholder="Send message"
                onChangeText={setInput}
                onSubmitEditing={sendMessage}
                value={input}
                />
                    <TouchableOpacity
                    onPress={sendMessage}
                    title="send"
                    
                    style={[tw("text-center items-center h-8 w-14 rounded-full"),{backgroundColor:"#FD7656"}]}
                    >
                        <Text style={tw("text-white my-1")}>Send</Text>
                    </TouchableOpacity>
                </View>                    
        </SafeAreaView>
  )
}

export default MessageScreen;