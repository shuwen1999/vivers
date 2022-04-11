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
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import { 
    useFonts,
    OleoScript_400Regular,
    OleoScript_700Bold 
  } from '@expo-google-fonts/oleo-script'
import Card from '../Components/Card';

const LocationScreen = () => {
    const navigation = useNavigation();
    const {user, logout} = useAuth();
    const [profiles, setProfiles] = useState([]);
    const swipeRef = useRef(null);
    const {params} = useRoute();
    const {loggedInProfile, chosenUser, friendDetails} = params;
    const day = 86400000;
    const uniqueId = () => parseInt((Date.now()/day) * Math.random()).toString();
    let [fontsLoaded] = useFonts({
        
        OleoScript_700Bold 
      });

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
            sessionId: oneid,
            creatorId:user.uid,
            creatorName:user.displayName,
            location:chosenLocation.Name,
            friendId:getMatchedUserInfo(friendDetails.users,user.uid).id,
            friendName:getMatchedUserInfo(friendDetails.users,user.uid).displayName,
            timestamp: serverTimestamp(),
            
          });
        
        navigation.navigate("Swipe",{
            chosenLocation,
            oneid,
            friendDetails,
        });
        
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
                
                <Text style={[tw("text-lg ml-16"),{fontFamily: 'OleoScript_700Bold'}]}>Choose a Location</Text>
            </View>
            
            {/* end of header */}
            
            {/* list */}
            
            <View>
                <FlatList
                    data={profiles}
                    keyExtractor = {(item,index)=>index.toString()}
                    numColumns={2}
                    ListFooterComponent={<View style={{height: 100}}/>}
                    renderItem={({item, index})=> item? (
                    
                    <TouchableOpacity  
                        style={{flexDirection:'row', alignItems:'center', backgroundColor: item.selected?'orange':'white'}}
                        onPress={() => onClickItem(item,index)}
                        
                    >
                        <Card> 
                            <Image
                                style={tw(" h-32 w-32")}
                                source={{uri:item.Image}}
                                
                            />
                            <Text style={styles.item}key={item.id}>{item.Name}</Text>
                            
                        </Card>
                        
                       
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