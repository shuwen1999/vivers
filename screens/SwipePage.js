import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';
import { View, Text , Button, SafeAreaView, TouchableOpacity, Image, StyleSheet} from 'react-native';
import userAuth from '../hooks/useAuth';
import tw from "tailwind-rn";
import { FontAwesome, Ionicons, Entypo } from '@expo/vector-icons'; 
import Swiper from "react-native-deck-swiper";

const DUMMY_DATA = [
    {
        photoURL: require('../assets/papajohns.png'),
        restaurant: "Papa Johns",
        location:"Jurong Point B1-35",
        id:123,
    },
    {
        photoURL: require('../assets/sweechoon.png'),
        restaurant: "Swee Choon",
        location:"Hougang Mall 02-05",
        id:456,
    },
    {
        photoURL: require('../assets/papajohns.png'),
        restaurant: "Nikki Nandos",
        location:"Vivocity 02-56B",
        id:789,
    },
];


const SwipeScreen = () => {
    const navigation = useNavigation();
    const {user, logout} = userAuth();

    return (
        <SafeAreaView style={tw("flex-1")}>
            {/* header */}
            <View style={tw('flex-row items-center justify-around relative top-10')}>
                <TouchableOpacity>
                    <Ionicons name="home" size={30} color="#FD7656" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                    <Ionicons name="chatbubbles" size={30} color="grey" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                    <FontAwesome name="user" size={30} color="grey" />
                </TouchableOpacity>

            </View>
            
            {/* end of header */}
            
            {/* cards */}
            <View style={tw("flex-1 mt-6")}>
                <Swiper
                    containerStyle={{backgroundColor:"transparent"}}
                    cards={DUMMY_DATA}
                    stackSize={5}
                    cardsIndex={0}
                    animateCardOpacity
                    onSwipedLeft={()=>{
                        console.log("Swipe PASS")
                    }}
                    onSwipedRight={()=>{
                        console.log("Swipe MATCH")
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
                    renderCard={(cards)=>(
                        <View key={cards.id} style={tw("relative bg-white h-5/6 rounded-xl")}>
                            <Image
                                style={tw("absolute top-0 h-full w-full rounded-xl")}
                                source={cards.photoURL}
                            />
                            <View style={[
                                tw("absolute bottom-0 justify-between flex-row items-center bg-black bg-opacity-60 w-full h-20 px-6 py-2 rounded-b-xl"
                                ),styles.cardShadow,
                            ]
                        }>
                                <View>
                                <Text style={tw("text-white text-2xl font-bold")}>{cards.restaurant}</Text>
                                <Text style={tw("text-white")}>{cards.location}</Text>
                                </View>
                                <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                                    <Entypo name="info-with-circle" size={30} color="white" />
                                </TouchableOpacity>
                            </View>
                            
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