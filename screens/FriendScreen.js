import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect, useState, useRef, useEffect } from 'react';
import { View, Text ,TextInput, Button, SafeAreaView, TouchableOpacity, Image, StyleSheet, FlatList, StatusBar} from 'react-native';
import useAuth from '../hooks/useAuth';
import tw from "tailwind-rn";
import { FontAwesome, Ionicons, Entypo, MaterialIcons } from '@expo/vector-icons'; 
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
        const newArrData = profiles.map((e,index)=>{
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
                    // modal screen that says we are friends and to head to chat screen 
                       
                    }
                    else{
                        console.log("friend has not added u");
                        //add friend in database
                        setDoc(doc(db,"users", user.uid, "friends", chosenUser.id),chosenUser).catch((error)=>{
                            console.log(error) });
                    //modal screen that say i have add friend but friend has not added me, remain on page
                    }
                }
            )
            
           
            navigation.navigate("Location",{
                loggedInProfile,
                chosenUser,
            });
            if (chosenUser.id == e.id){
                return{
                    ...e,
                    selected:true
                    
                }
            }
            return{
                selected:false
            }
            
        })
        setProfiles(newArrData);
    }

    
    return (
        <SafeAreaView style={tw("flex-1")}>
            {/* header */}
            <View style={tw('flex-row items-center justify-around relative top-16')}>
                <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                    <Ionicons name="home" size={30} color="grey" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
                    <Ionicons name="chatbubbles" size={30} color="grey" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Friend")}>
                    <FontAwesome name="user" size={30} color="#FD7656" />
                </TouchableOpacity>

            </View>
            
            {/* end of header */}
            <View style={tw("ml-4 mt-4")}>
                <Text style={tw("text-xl font-bold p-4 mt-20")}>Search</Text>
            </View>
            <TextInput
            // value={username}
            // onChangeText={(text) => setUsername(text)} 
                style={[tw("text-center py-2 px-8  "),{backgroundColor:"#E2E8F0", color:"#BDBDBD"}]}
                placeholder="Update Username"
            
            />
            {/* list */}
            
            <View>
                <FlatList
                    data={profiles}
                    keyExtractor = {(item,index)=>index.toString()}
                    renderItem={({item, index})=> item? (
                    
                    <TouchableOpacity  
                        style={{flexDirection:'row', alignItems:'center', backgroundColor: item.selected?'orange':'white'}}
                        onPress={() => onClickItem(item,index)}
                        
                    >
                        <Text style={styles.item}key={item.id}>{item.displayName}</Text>
                        <MaterialIcons name="navigate-next" size={24} color="black" />
                        
                       
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