import React, {useEffect, useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import tw from 'tailwind-rn';
import {db} from '../firebase';
import {collection, onSnapshot, query, where} from '@firebase/firestore';
import useAuth from "../hooks/useAuth";
import ChatRow from './ChatRow';
import { useNavigation } from '@react-navigation/native';

const ChatList =()=>{
    const [friends, setFriends] = useState([]);
    const {user} = useAuth();
    const navigation = useNavigation();

    useEffect(
        ()=>
        onSnapshot(
            query(
                collection(db, "friends"),
                where("userFriends", 'array-contains', user.uid)
        ),
       (snapshot)=>
            setFriends(
                snapshot.docs.map((doc)=> ({
                    id:doc.id,
                    ...doc.data(),
                }))
            )
        ),[user]
    );

    //console.log(user.uid);

    return (
        friends.length>0?(
             <View>
                 <FlatList
                style={tw("h-full")}
                data={friends}
                keyExtractor={item =>item.id}
                renderItem={({item})=> <ChatRow friendDetails={item}/>}
             />
             </View>
             
        ):(
            <View style={tw("my-20 p-5")}>
                <Text>No friends at the moment</Text>
            </View>
        )
       
    );

};

export default ChatList;