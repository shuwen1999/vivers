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
import Clipboard from '@react-native-clipboard/clipboard';
import { Lora_400Regular,
    Lora_500Medium,
    Lora_600SemiBold,
    Lora_700Bold,
    Lora_400Regular_Italic,
    Lora_500Medium_Italic,
    Lora_600SemiBold_Italic,
    Lora_700Bold_Italic, useFonts } from '@expo-google-fonts/lora';




const SwipeScreen = () => {
    const navigation = useNavigation();
    const {user, logout} = useAuth();
    const [profiles, setProfiles] = useState([]);
    const swipeRef = useRef(null);
    const {params} = useRoute();
    const {chosenLocation, oneid, friendDetails} = params;
    const [copiedText, setCopiedText] = useState('')
    let [fontsLoaded] = useFonts({
        Lora_500Medium,
        Lora_600SemiBold,
        Lora_700Bold,
        Lora_400Regular_Italic,
        Lora_500Medium_Italic,
        Lora_600SemiBold_Italic,
        Lora_700Bold_Italic,
        
      });
    
            
    useEffect(()=> {
        let unsub;

                
        const fetchCards = async() =>{

            // const swipes = await getDocs(collection(db,"users", user.uid,"swipes")).then
            // (snapshot => snapshot.docs.map((doc)=>doc.id)
            // );

            // const swipedRestaurant = swipes.length>0?swipes:['test'];
            
            unsub = onSnapshot(collection(db, "malls",chosenLocation.Name, "eateries"), (snapshot) => {
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

        setDoc(doc(db,"users",user.uid,'sessions', oneid, "passed", restaurantSwiped.Name),restaurantSwiped).catch((error)=>{
            console.log(error)});

    };

    const swipeRight = async(cardIndex)=>{
        if (!profiles[cardIndex]) return;

        const restaurantSwiped = profiles[cardIndex];
        //console.log('You swiped MATCH on '+ restaurantSwiped.Name);

        //console.log(user.displayName);
        setDoc(doc(db,"users",user.uid,'sessions', oneid, 'swiped', restaurantSwiped.Name),restaurantSwiped).catch((error)=>{
            console.log(error)});
        
    }
    
    //console.log(profiles);
    return (
        <SafeAreaView style={tw("flex-1")}>
            {/* header */}
            <View style={tw('flex-row py-2 relative mt-10 items-center bg-gray-200')}>
                <TouchableOpacity style={tw("pl-6")}
                    onPress={()=> navigation.goBack()}
                >
                <Ionicons name="chevron-back" size={30} color="black" />
                </TouchableOpacity>
                
                <Text style={[tw("text-lg ml-20"),{fontFamily: 'OleoScript_700Bold'}]}>Matching...</Text>
                <Text style={[tw("rounded-lg h-8 w-20 text-center text-lg absolute right-4"),{backgroundColor:"#FD7656", color:"white", fontFamily:"Lora_700Bold"}]}>{oneid}</Text>
            </View>
            
            {/* end of header */}
            {/* <View style={[tw("mx-6 top-4 flex-row items-start "),{}]}>
                {/* <Text style={[tw("text-center text-lg h-8"),{fontFamily:"Lora_600SemiBold"}]}>Session ID: </Text> */}
                {/* <Text style={[tw("rounded-lg h-8 w-20 text-center text-lg"),{backgroundColor:"#FD7656", color:"white", fontFamily:"Lora_700Bold"}]}>{oneid}</Text> */}
                
            {/* </View> */}
            
            <Text
                style={[tw("mx-6 top-10 text-base"),{fontFamily:"Lora_700Bold"}]}
            >Location: {chosenLocation.Name}</Text>
            {/* cards */}
            <View style={tw("flex-1")}>
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
                                <Text style={tw("text-white")}>Opening Hours: {cards.Opening}</Text>
                                </View>
                                <TouchableOpacity onPress={() => navigation.navigate("Modal",{cards})}>
                                    <Entypo name="info-with-circle" size={30} color="white" />
                                </TouchableOpacity>
                            </View>
                            
                        </View>

                    ):(
                        <View style={tw("relative bg-white h-3/4 rounded-xl justify-center items-center")}>
                            <Text style={tw("font-bold pb-5")}>No more cards</Text>
                            <TouchableOpacity onPress={()=> navigation.navigate("Message",{oneid, friendDetails})}>
                                <Text>Click here to go to chat</Text>
                            </TouchableOpacity>
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