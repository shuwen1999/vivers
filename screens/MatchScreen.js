import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native'
import React, {useEffect, useState} from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import useAuth from '../hooks/useAuth';
import { getDoc, QuerySnapshot, collection, getDocs, query, where, doc, setDoc, deleteDoc } from 'firebase/firestore';
import {db} from "../firebase";
import { LogBox } from 'react-native';
import generateId from '../lib/generateId';
import { async } from '@firebase/util';
import tw from 'tailwind-rn';

LogBox.ignoreLogs(['Setting a timer']);

const MatchScreen = () => {
    const navigation = useNavigation();
    const {user} = useAuth();
    const {params} = useRoute();
    const {sessionDetails, creatorId, sessionId} = params;
    const [mypass, setMypass] = useState([]);
    // useEffect(()=> {
    //     let unsub;

    //     const fetchCards = async() =>{
           
        
    //         unsub = onSnapshot(collection(db, "malls",sessionDetails.location, "eateries"), (snapshot) => {
    //             setProfiles(
    //                 snapshot.docs.map((doc) =>({
    //                     // id: docid,
    //                     ...doc.data(),
    //                 }))
    //             );
    //         });
    //     };
    //     fetchCards();
    //     return unsub;
    // },[])

    const onClickItem = async() =>{
        const combinedId= generateId(user.uid,creatorId);

        const match1 = await getDocs(collection(db, "friends", combinedId, "sessions", sessionId, "matched"));
        const passed = await getDocs(collection(db,"users", creatorId, "sessions", sessionId, "passed"));
        
        // const documentIds = match1.map(it =>it.id);
        // console.log(documentIds);

        passed.forEach((doc)=>{
            console.log(doc.id);
            
                setMypass(doc.id);
            
            //setMypass(doc.id);
        });
        console.log("first")
        console.log(mypass);

        deleteDoc(doc(db,"friends", combinedId,"sessions",sessionId,"matched",mypass));

        console.log("all matched");
        // match1.forEach((doc)=>{
        //     matchId = doc.id;
        //     return {matchId};
        // })
        // console.log(matchId);
    }
    



  return (
    <SafeAreaView>
      <TouchableOpacity 
      style={tw('flex-row items-center justify-around relative top-16')}
      onPress={()=>onClickItem()}>
          <Text>onloaditem pls click this</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default MatchScreen;