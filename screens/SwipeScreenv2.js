import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useLayoutEffect, useState, useRef, useEffect } from 'react';
import { View, Text , Button, SafeAreaView, TouchableOpacity, Image, StyleSheet} from 'react-native';
import useAuth from '../hooks/useAuth';
import tw from "tailwind-rn";
import { FontAwesome, Ionicons, Entypo } from '@expo/vector-icons'; 
import Swiper from "react-native-deck-swiper";
import { collection, onSnapshot, doc, setDoc, getDocs } from 'firebase/firestore';
import {db} from "../firebase";
import { async } from '@firebase/util';
import generateId from '../lib/generateId';
// import { FirebaseError } from 'firebase/app';



const SwipeScreenv2 = () => {
    const navigation = useNavigation();
    const {user} = useAuth();
    const [profiles, setProfiles] = useState([]);
    const swipeRef = useRef(null);
    const {params} = useRoute();
    const {sessionDetails, creatorId, sessionId} = params;

    //console.log("lcoation is " + sessionDetails.location);
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
            
            unsub = onSnapshot(collection(db, "malls",sessionDetails.location, "eateries"), (snapshot) => {
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
        //console.log('You swiped PASS on '+ restaurantSwiped.Name);

        // setDoc(doc(db,"users",user.uid,'sessions', restaurantSwiped.Name),restaurantSwiped).catch((error)=>{
        //     console.log(error)});

        setDoc(doc(db,"users",user.uid,'sessions', sessionId),sessionDetails);

        setDoc(doc(db,"users",user.uid,'sessions', sessionId, "passed", restaurantSwiped.Name),restaurantSwiped).catch((error)=>{
            console.log(error)});

        //in the user.uid, add the restaurant id and place all restaurantSwiped data in doc
        //setDoc(doc(db,"users",user.uid,"passes", restaurantSwiped.id), restaurantSwiped);
    };

    const swipeRight = async(cardIndex)=>{
        if (!profiles[cardIndex]) return;

        const restaurantSwiped = profiles[cardIndex];
        const combinedId= generateId(user.uid,creatorId);
        //console.log('You swiped MATCH on '+ restaurantSwiped.Name);

        setDoc(doc(db,"users",user.uid,'sessions', sessionId),sessionDetails);

        //console.log(user.displayName);
        setDoc(doc(db,"users",user.uid,'sessions', sessionId, 'swiped', restaurantSwiped.Name),restaurantSwiped).catch((error)=>{
            console.log(error)});
        
        
        setDoc(doc(db,"friends",combinedId,"sessions",sessionId),sessionDetails);
        setDoc(doc(db,"friends",combinedId,"sessions",sessionId, "matched",restaurantSwiped.Name),restaurantSwiped);
    }

    //console.log(profiles);
    return (
        <SafeAreaView style={tw("flex-1")}>
            {/* header */}
            <View style={tw('flex-row items-center justify-around relative top-16')}>
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
            <Text
                style={tw("mx-6 top-20")}
            >Session ID: {sessionId}</Text>
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
                        //console.log("Swipe PASS");
                        swipeLeft(cardIndex);
                    }}
                    onSwipedRight={(cardIndex)=>{
                        //console.log("Swipe MATCH");
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
                            <TouchableOpacity onPress={()=>navigation.navigate("Match",{sessionDetails,creatorId, sessionId})}>
                                <Text style={tw("font-bold pb-5")}>Go to Matches Page</Text>
                            </TouchableOpacity>
                            
                            {/* direct to matched pag */}
                        </View> 
                    )}
                    
                />
            </View>
            
             

        </SafeAreaView>
    )
}

export default SwipeScreenv2

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