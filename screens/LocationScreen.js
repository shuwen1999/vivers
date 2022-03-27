import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useLayoutEffect, useState, useRef, useEffect } from 'react';
import { View, Text ,TextInput, Button, SafeAreaView, TouchableOpacity, Image, StyleSheet, FlatList, StatusBar} from 'react-native';
import useAuth from '../hooks/useAuth';
import tw from "tailwind-rn";
import { FontAwesome, Ionicons, Entypo, MaterialIcons } from '@expo/vector-icons'; 
import { collection, onSnapshot, doc, setDoc, getDocs, getDoc, serverTimestamp, where, query, collectionGroup, QuerySnapshot, addDoc } from 'firebase/firestore';
import {db} from "../firebase";
import { async } from '@firebase/util';
import generateId from '../lib/generateId';

const LocationScreen = () => {
    const navigation = useNavigation();
    const {user, logout} = useAuth();
    const [profiles, setProfiles] = useState([]);
    const swipeRef = useRef(null);
    const {params} = useRoute();
    const {loggedInProfile, chosenUser} = params;
    const uniqueId = () => parseInt(Date.now() * Math.random()).toString();
    
    useEffect(()=> {
        let unsub;

                
        const fetchCards = async() =>{
            unsub = onSnapshot(collection(db, "malls"),(snapshot) => {
                setProfiles(
                    snapshot.docs.map((doc) =>({
                        // id: docid,
                        ...doc.data(),
                    }))
                );
            }
            );
        };
        
        fetchCards();
        return unsub;
    },[])
    
    const onClickItem = async(item,index) => {
        console.log(item.Name);
        const chosenLocation = item;
        const oneid = uniqueId();
        console.log(oneid);
        const docRef = await  setDoc(doc(db,"users",user.uid,'sessions',oneid), {
            creatorId:user.uid,
            creatorName:user.displayName,
            location:chosenLocation.Name,
            friendId:chosenUser.id,
            friendName:chosenUser.displayName,
            timestamp: serverTimestamp(),
            
          });
        
        navigation.navigate("Swipe",{
            chosenLocation,
            oneid,
            chosenUser,
        });
        
    }
    
    
    return (
        <SafeAreaView style={tw("flex-1")}>
            {/* header */}
            <View style={tw('flex-row items-center justify-around relative top-10')}>
                <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                    <Ionicons name="home" size={30} color="grey" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Swipe")}>
                    <Ionicons name="chatbubbles" size={30} color="grey" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                    <FontAwesome name="user" size={30} color="#FD7656" />
                </TouchableOpacity>

            </View>
            
            {/* end of header */}
            <View style={tw("ml-4 mt-4")}>
                <Text style={tw("text-base p-2 mt-20")}>
                    Start swiping with {chosenUser.displayName}!
                </Text>
                <Text style={tw("text-base p-2")}>
                    Choose a location:
                </Text>
            </View>
            
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
                        <Text style={styles.item}key={item.id}>{item.Name}</Text>
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

export default LocationScreen

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