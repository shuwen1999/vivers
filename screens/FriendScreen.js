import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect, useState, useRef, useEffect } from 'react';
import { View, Text ,TextInput, Button, SafeAreaView, TouchableOpacity, Image, StyleSheet, FlatList, StatusBar} from 'react-native';
import useAuth from '../hooks/useAuth';
import tw from "tailwind-rn";
import { FontAwesome, Ionicons, Entypo, AntDesign } from '@expo/vector-icons'; 
import Swiper from "react-native-deck-swiper";
import { collection, onSnapshot, doc, setDoc, getDocs } from 'firebase/firestore';
import {db} from "../firebase";
import { async } from '@firebase/util';
// import { FirebaseError } from 'firebase/app';



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
                    snapshot.docs.map((doc) =>({
                        // id: docid,
                        ...doc.data(),
                    }))
                );
            });
        };
        fetchCards();
        return unsub;
    },[])
    

    console.log(profiles);
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
                   
                    renderItem={({item})=> item?(<View  style={{flexDirection:'row', alignItems:'center'}}>
                        <Text style={styles.item}key={item.id}>{item.displayName}</Text>
                        <TouchableOpacity>
                             <AntDesign name="pluscircleo" size={24} color="black" />
                        </TouchableOpacity>
                       
                    </View>):(
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
      height: 44,
    },
  });