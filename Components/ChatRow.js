import { View, Text, TouchableOpacity, Image } from 'react-native'
import React,  {useEffect, useState} from 'react'
import { useNavigation } from '@react-navigation/native'
import useAuth from '../hooks/useAuth';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import tw from 'tailwind-rn';
import { onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import {db} from '../firebase';
import { serverTimestamp } from 'firebase/firestore';


const ChatRow = ({friendDetails}) => {
    const navigation = useNavigation();
    const {user} = useAuth();
    const [matchedUserInfo, setMatchedUserInfo] = useState(null);
    const [lastMessage, setLastMessage] = useState('');

    useEffect(()=>{
        setMatchedUserInfo(getMatchedUserInfo(friendDetails.users, user.uid));
    },[friendDetails, user]);

    useEffect(
        ()=> onSnapshot(
            query(
                collection(db,"friends", friendDetails.id, "messages"),
                orderBy("timestamp","desc")
            ), snapshot => setLastMessage(snapshot.docs[0]?.data()?.message)
        ),

    [friendDetails,db])

    return (
    <TouchableOpacity 
        style={tw("flex-row items-center py-4 px-5 bg-white mx-3 my-20 rounded-lg")}
        onPress={()=> navigation.navigate("Message", {
            friendDetails,
        })}>

        {matchedUserInfo?.photoURL?
        <Image
        style={tw("rounded-full h-16 w-16 mr-4")}
        source={{uri:matchedUserInfo?.photoURL}}
        />
        
        :
        <Image
            style={tw("rounded-full h-16 w-16 mr-4")}
            source={{uri:matchedUserInfo?.ogURL}}
            
        />
        }
        
        <View>
            <Text style={tw("text-lg font-semibold")}>
                {matchedUserInfo?.displayName}
            </Text>
            <Text>{lastMessage || "Say Hi"}</Text>
        </View>
        
    </TouchableOpacity>
  );
};

export default ChatRow;