import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect, useState, useRef, useEffect } from 'react';
import { View, Text , Button, SafeAreaView, TouchableOpacity, Image, StyleSheet} from 'react-native';
import useAuth from '../hooks/useAuth';
import tw from "tailwind-rn";
import { FontAwesome, Ionicons, Entypo } from '@expo/vector-icons'; 
import Swiper from "react-native-deck-swiper";
import { collection, onSnapshot, doc, setDoc, getDocs } from 'firebase/firestore';
import {db} from "../firebase";
import { async } from '@firebase/util';
// import { FirebaseError } from 'firebase/app';

// const DUMMY_DATA = [
//     {
//         photoURL: require('../assets/papajohns.png'),
//         restaurant: "Papa Johns",
//         location:"Jurong Point B1-35",
//         id:123,
//     },
//     {
//         photoURL: require('../assets/sweechoon.png'),
//         restaurant: "Swee Choon",
//         location:"Hougang Mall 02-05",
//         id:456,
//     },
//     {
//         photoURL: require('../assets/papajohns.png'),
//         restaurant: "Nikki Nandos",
//         location:"Vivocity 02-56B",
//         id:789,
//     },
// ];


const SwipeScreen = () => {
    const navigation = useNavigation();
    const {user, logout} = useAuth();
    const [profiles, setProfiles] = useState([]);
    const swipeRef = useRef(null);
    
    // if no profile, trigger modal screen
    useLayoutEffect(()=>
        onSnapshot(doc(db,"users",user.uid),(snapshot)=>{
            if (!snapshot.exists()){
                navigation.navigate("Modal");
            }
            
        }),
        []
        );

    useEffect(()=> {
        let unsub;

                
        const fetchCards = async() =>{

            // const swipes = await getDocs(collection(db,"users", user.uid,"swipes")).then
            // (snapshot => snapshot.docs.map((doc)=>doc.id)
            // );

            // const swipedRestaurant = swipes.length>0?swipes:['test'];
            
            unsub = onSnapshot(collection(db, "restaurants"), (snapshot) => {
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

    const swipeLeft = async(cardIndex)=>{
        //if no swipe then just return
        if (!profiles[cardIndex]) return;

        const restaurantSwiped = profiles[cardIndex];
        console.log('You swiped PASS on '+ restaurantSwiped.Name);

        console.log(user.displayName);
        setDoc(doc(db,"users",user.uid,'passes', restaurantSwiped.Name),restaurantSwiped).catch((error)=>{
            console.log(error)});
        //in the user.uid, add the restaurant id and place all restaurantSwiped data in doc
        //setDoc(doc(db,"users",user.uid,"passes", restaurantSwiped.id), restaurantSwiped);
    };

    const swipeRight = async(cardIndex)=>{
        if (!profiles[cardIndex]) return;

        const restaurantSwiped = profiles[cardIndex];
        console.log('You swiped MATCH on '+ restaurantSwiped.Name);

        console.log(user.displayName);
        setDoc(doc(db,"users",user.uid,'swipes', restaurantSwiped.Name),restaurantSwiped).catch((error)=>{
            console.log(error)});
    }

    console.log(profiles);
    return (
        <SafeAreaView style={tw("flex-1")}>
            {/* header */}
            <View style={tw('flex-row items-center justify-around relative top-10')}>
                <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                    <Ionicons name="home" size={30} color="grey" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Swipe")}>
                    <Ionicons name="chatbubbles" size={30} color="#FD7656" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                    <FontAwesome name="user" size={30} color="grey" />
                </TouchableOpacity>

            </View>
            
            {/* end of header */}
            
            {/* cards */}
            <View style={tw("flex-1 mt-6")}>
                <Swiper
                    ref={swipeRef}
                    containerStyle={{backgroundColor:"transparent"}}
                    cards={profiles}
                    stackSize={5}
                    cardsIndex={0}
                    animateCardOpacity
                    onSwipedLeft={(cardIndex)=>{
                        console.log("Swipe PASS");
                        swipeLeft(cardIndex);
                    }}
                    onSwipedRight={(cardIndex)=>{
                        console.log("Swipe MATCH");
                        swipeRight(cardIndex);
                    }}
                    backgroundColor={"#FD7656"}
                    verticalSwipe={false}
                    overlayLabels={{
                        left:{
                            title:"NOPE",
                            style:{
                                label:{
                                    textAlign:"right",
                                    color:"red",
                                },
                            },
                        },
                        right:{
                            title:"MATCH",
                            style:{
                                label:{
                                    textAlign:"left",
                                    color:"green",
                                },
                            },
                        },
                    }}
                    renderCard={(cards)=> cards? (
                        <View key={cards.id} style={tw("relative bg-white h-5/6 rounded-xl")}>
                            <Image
                                style={tw("absolute top-0 h-full w-full rounded-xl")}
                                // source={cards.photoURL}
                                source={{ uri: cards.Image }}
                            />
                            <View style={[
                                tw("absolute bottom-0 justify-between flex-row items-center bg-black bg-opacity-60 w-full h-20 px-6 py-2 rounded-b-xl"
                                ),styles.cardShadow,
                            ]
                        }>
                                <View>
                                <Text style={tw("text-white text-2xl font-bold")}>{cards.Name}</Text>
                                <Text style={tw("text-white")}>{cards.id}</Text>
                                </View>
                                <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                                    <Entypo name="info-with-circle" size={30} color="white" />
                                </TouchableOpacity>
                            </View>
                            
                        </View>

                    ):(
                        <View style={tw("relative bg-white h-3/4 rounded-xl justify-center items-center")}>
                            <Text style={tw("font-bold pb-5")}>No more cards</Text>
                            {/* direct to matched pag */}
                        </View> 
                    )}
                    
                />
            </View>
            
             

        </SafeAreaView>
    )
}

export default SwipeScreen

const styles = StyleSheet.create({
    cardShadow:{
        shadowColor:"#000",
        shadowOffset:{
            width:0,
            height:1,
        },
        shadowOpacity:0.2,
        shadowRadius:1.41,
        elevation:2,
    },
});