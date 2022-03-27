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

const MessageScreen = () => {
    const navigation = useNavigation();
    const {user} = useAuth();
    const {params} = useRoute();
    const [input, setInput] = useState("");
    const {friendDetails} = params;
    
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

    // const onClickItem = async() => {
    //     const loggedInProfile = await(
    //         await getDoc(doc(db,"users",user.uid))
    //     ).data(); 
    //     const newArrData = profiles.map((e,index)=>{
    //         console.log("loggedin user is " + user.uid);
    //         console.log("user friend is "+ friendDetails.users[user.uid].id);
            
            
            
    //         //check if user added me as friend
    //         getDoc(doc(db,"users",chosenUser.id, "friends", user.uid)).then(
    //             (documentSnapshot) =>{
    //                 if (documentSnapshot.exists()){
    //                     console.log("friend exists");

    //                     //add friend in database
    //                     setDoc(doc(db,"users", user.uid, "friends", chosenUser.id),chosenUser).catch((error)=>{
    //                         console.log(error) });

    //                     //create a friend database
    //                     setDoc(doc(db,"friends",generateId(user.uid, chosenUser.id)),{
    //                         users:{
    //                             [user.uid]:loggedInProfile,
    //                             [chosenUser.id]:chosenUser
    //                         },
    //                         userFriends:[user.uid,chosenUser.id],
    //                         timestamp: serverTimestamp()
    //                     });
    //                 // modal screen that says we are friends and to head to chat screen 
                       
    //                 }
    //                 else{
    //                     console.log("friend has not added u");
    //                     //add friend in database
    //                     setDoc(doc(db,"users", user.uid, "friends", chosenUser.id),chosenUser).catch((error)=>{
    //                         console.log(error) });
    //                 //modal screen that say i have add friend but friend has not added me, remain on page
    //                 }
    //             }
    //         )
            
           
    //         // navigation.navigate("Location",{
    //         //     loggedInProfile,
    //         //     chosenUser,
    //         // });
    //         if (chosenUser.id == e.id){
    //             return{
    //                 ...e,
    //                 selected:true
                    
    //             }
    //         }
    //         return{
    //             selected:false
    //         }
            
    //     })
    //     setProfiles(newArrData);
    // }
    

    return (
        <SafeAreaView style={tw("flex-1")}>
            <View style={tw('flex-row px-6 py-3 relative top-10 items-center justify-between')}>
                <TouchableOpacity
                    onPress={()=> navigation.goBack()}
                >
                <Ionicons name="chevron-back" size={30} color="black" />
                </TouchableOpacity>
                
                <Text>{getMatchedUserInfo(friendDetails.users, user.uid).displayName}</Text>
                {getMatchedUserInfo(friendDetails.users, user.uid)?.photoURL?
                <Image
                style={tw("rounded-full h-12 w-12 mr-4")}
                source={{uri:getMatchedUserInfo(friendDetails.users, user.uid)?.photoURL}}
                />
                
                :
                <Image
                    style={tw("rounded-full h-12 w-12 mr-4")}
                    source={{uri:getMatchedUserInfo(friendDetails.users, user.uid)?.ogURL}}
                    
                />
                }
                
            </View>
            
            <TouchableOpacity 
                style={[
                    tw("w-52 p-2 rounded-2xl top-10"), 
                    {marginTop:10,marginHorizontal: "25%", backgroundColor: "#FD7656"},
                ]}
                onPress={() => navigation.navigate("Swipe")}
                >
                    {/* not showing user.newName as not data is not realtime */}
                    <Text 
                        style={tw("font-semibold text-center text-white")} 
                        >Start Matching</Text>
            </TouchableOpacity>
            

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
                    placeholder="send message"
                    onChangeText={setInput}
                    onSubmitEditing={sendMessage}
                    value={input}
                    />
                    <TouchableOpacity
                    onPress={sendMessage}
                    title="send"
                    
                    style={[tw("text-center items-center h-8 w-14 rounded-full"),{backgroundColor:"#FD7656"}]}
                    >
                        <Text style={tw("text-white")}>Send</Text>
                    </TouchableOpacity>
                </View>                    
        </SafeAreaView>
  )
}

export default MessageScreen;