import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect, useState, useRef, useEffect } from 'react';
import { View, Text ,TextInput, Alert, SafeAreaView, TouchableOpacity, Image, StyleSheet, FlatList, StatusBar} from 'react-native';
import useAuth from '../hooks/useAuth';
import tw from "tailwind-rn";
import { FontAwesome, Ionicons, Entypo, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import { collection, onSnapshot, doc, setDoc, getDocs, getDoc, serverTimestamp } from 'firebase/firestore';
import {db} from "../firebase";
import { async } from '@firebase/util';
import generateId from '../lib/generateId';


const SwipeScreen = () => {
    const navigation = useNavigation();
    const {user, logout} = useAuth();
    const [profiles, setProfiles] = useState([]);
    const swipeRef = useRef(null);
    useEffect(()=> {
        let unsub;

                
        const fetchCards = async() =>{
            unsub = onSnapshot(collection(db, "users"), (snapshot) => {
                setProfiles(
                    snapshot.docs
                    .filter((doc)=>doc.id!== user.uid)
                    .map((doc) =>({
                        //id: docid,
                        ...doc.data(),
                    }))
                );
            });
        };
        fetchCards();
        return unsub;
    },[])
    
    

    const onClickItem = async(item,index) => {
        const loggedInProfile = await(
            await getDoc(doc(db,"users",user.uid))
        ).data(); 
        
            const chosenUser = item;
            console.log("loggedin user is " + user.uid);
            console.log("user added is "+ chosenUser.id);
        
            //check if user added me as friend
            getDoc(doc(db,"users",chosenUser.id, "friends", user.uid)).then(
                (documentSnapshot) =>{
                    if (documentSnapshot.exists()){
                        console.log("friend exists");

                        //add friend in database
                        setDoc(doc(db,"users", user.uid, "friends", chosenUser.id),chosenUser).catch((error)=>{
                            console.log(error) });

                        //create a friend database
                        setDoc(doc(db,"friends",generateId(user.uid, chosenUser.id)),{
                            users:{
                                [user.uid]:loggedInProfile,
                                [chosenUser.id]:chosenUser
                            },
                            userFriends:[user.uid,chosenUser.id],
                            timestamp: serverTimestamp()
                        });
                        Alert.alert(
                            "Already added as Friend",
                            "Redirect to Chat Screen to Message Friend?",
                            [
                                {
                                    text: "Go to Chat Screen",
                                    onPress: () => navigation.navigate("Chat"),
                                    style: "cancel",
                                  },
                                {
                                text: "Cancel",
                                style: "cancel",
                              },
                            ],
                            
                          );
                        
                       
                    }
                    else{
                        console.log("friend has not added u");
                        //add friend in database
                        setDoc(doc(db,"users", user.uid, "friends", chosenUser.id),chosenUser).catch((error)=>{
                            console.log(error) });
                            Alert.alert(
                                "Friend has not added you",
                                "Please prompt friend to add as friend to start matching",
                                [
                                    {
                                    text: "Okayy",
                                    style: "cancel",
                                  },
                                ],
                                
                              );
                            
                    
                    }
                }
            )
            
    }

    
    return (
        <SafeAreaView style={tw("flex-1")}>
            {/* header */}
            <View style={tw('flex-row py-2 relative mt-10 items-center bg-gray-200')}>
                <TouchableOpacity style={tw("pl-6")}
                    onPress={()=> navigation.goBack()}
                >
                <Ionicons name="chevron-back" size={30} color="black" />
                </TouchableOpacity>
                
                <Text style={[tw("text-lg ml-20"),{fontFamily: 'OleoScript_700Bold'}]}>Add Friends</Text>
            </View>
            
            {/* end of header */}
            
            {/* list */}
            
            <View style={tw("flex-1 top-4")}>
                <FlatList
                    data={profiles}
                    keyExtractor = {(item,index)=>index.toString()}
                    renderItem={({item, index})=> item? (
                    
                    <TouchableOpacity  
                        style={[tw("flex-row items-center py-2 px-5 bg-white mx-3 my-1 rounded-lg"),{backgroundColor: item.selected?'orange':'white'}]}
                        
                        onPress={() => onClickItem(item,index)}
                        
                    >
                        <Image
                            style={tw("rounded-full h-12 w-12 mr-4")}
                            source={{uri:item.ogURL}}
                            
                        />
                        <Text style={styles.item}key={item.id}>{item.displayName}</Text>
                        <MaterialCommunityIcons name="plus" size={24} color="black" />
                        
                       
                    </TouchableOpacity>):(
                        <Text>no data</Text>
                    )
                }
               />
            </View>
             

        </SafeAreaView>
    )
}

export default SwipeScreen

const styles = StyleSheet.create({
    container: {
     flex: 1,
     paddingTop: 5
    },
    item: {
      padding: 10,
      fontSize: 18,
      height: 44
    },
  });