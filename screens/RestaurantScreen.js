import { View, Text, Image, TouchableOpacity, SafeAreaView } from 'react-native'
import React, {useEffect, useState} from 'react'
import { collectionGroup, query, where, getDocs, setDoc, deleteDoc,doc,onSnapshot, getDoc } from "firebase/firestore";  
import {db} from "../firebase";
import tw from "tailwind-rn";
import { useNavigation, useRoute } from '@react-navigation/native';
import { SimpleLineIcons, Entypo, Ionicons, MaterialIcons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import useAuth from '../hooks/useAuth';

const RestaurantScreen = () => {
    const navigation = useNavigation();
    const {params} = useRoute();
    const {chosenRestaurant} = params;
    const [bookmark, setBookmark] = useState("bookmark-outline");
    const [color, setColor] = useState("gray")
    const {user} = useAuth();
    const [restaurant,setRestaurant] = useState();

    useEffect(()=> {
        let unsub;

                
        const fetchCards = async() =>{
            unsub = onSnapshot(query(collectionGroup(db, "eateries"),where("Name", "==", chosenRestaurant.Name)), (snapshot) => {
                setRestaurant(
                    snapshot.docs
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

    useEffect(()=>{
        getDoc(doc(db,"users",user.uid,"bookmarked",chosenRestaurant.Name)).then(
            (documentSnapshot) =>{
                if (documentSnapshot.exists()){
                    setBookmark("bookmark");
                    setColor("#FFD801");
                }else{
                    setBookmark("bookmark-outline");
                    setColor("gray");
                }
            }
        )
    })

    const onBookmark = async ()=>{
        
        if (bookmark == "bookmark-outline"){
            setBookmark("bookmark");
            setColor("#FFD801");
            setDoc(doc(db,"users",user.uid, "bookmarked", chosenRestaurant.Name), chosenRestaurant);
        }else{
            setBookmark("bookmark-outline");
            setColor("gray");
            deleteDoc(doc(db,"users",user.uid, "bookmarked", chosenRestaurant.Name));
        }
        
    }

    return (
    <SafeAreaView style={tw("flex-1")}>
        <Text>Bookmarked</Text>
        <View style={tw("items-center bg-gray-200 h-1/4")}>
            <Image
                style={tw(" h-full w-1/2 mr-4 my-16")}
                source={{uri:chosenRestaurant.Image}}
            />
            <TouchableOpacity style={tw("absolute right-4 top-16")}
                onPress={()=>onBookmark()}>
                    <MaterialIcons name={bookmark} size={24} color={color} />
                </TouchableOpacity>
        </View>
        <View>
            <Text
                style={tw("text-lg font-bold text-center mt-20 mb-8")}
            >{chosenRestaurant.Name}</Text>
            
            
            
            <View style={tw("flex-row items-center mx-4 mb-2")}>
                <Entypo name="location-pin" size={24} color="red" />
                <Text>Hougang Mall, JEM</Text>
            </View>
            
            <View style={tw("flex-row items-center mx-4 mb-2")}>
                <MaterialIcons name="call" size={24} color="red" />
                <Text>+65 98475939</Text>
            </View>
            
            <View style={tw("flex-row items-center mx-4 mb-2")}>
                <MaterialCommunityIcons name="clock" size={24} color="red" />
                <Text>11.30am to 9.30pm</Text>
            </View>
            
            
            <Text style={tw("mx-4")}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis magna nunc, gravida ac tellus id, scelerisque blandit tortor. Phasellus nec augue elit. Suspendisse auctor nisi at porta pellentesque. Etiam at tortor venenatis, rutrum odio sit amet, mattis turpis. Vestibulum ullamcorper neque ac tristique ultricies. Cras pellentesque sit amet ex et consequat. In auctor vehicula tellus, nec aliquam odio maximus a.
            </Text>
        </View>
    </SafeAreaView>
    
  )
}

export default RestaurantScreen