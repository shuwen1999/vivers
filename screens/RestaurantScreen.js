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
        
        <View style={tw("items-center bg-gray-200 h-1/4")}>
            <TouchableOpacity
                    style={tw("absolute left-4 top-16")}
                    onPress={()=> navigation.goBack()}
                >
                <Ionicons name="chevron-back" size={30} color="black" />
            </TouchableOpacity>

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
                <Text>{chosenRestaurant.Branches}</Text>
            </View>
            
            <View style={tw("flex-row items-center mx-4 mb-2")}>
                <MaterialIcons name="call" size={24} color="red" />
                <Text>{chosenRestaurant.Phone}</Text>
            </View>
            
            <View style={tw("flex-row items-center mx-4 mb-2")}>
                <MaterialCommunityIcons name="clock" size={24} color="red" />
                <Text>{chosenRestaurant.Opening}</Text>
            </View>
            
            
            <Text style={tw("mx-4")}>
            {chosenRestaurant.Desc}
            </Text>
        </View>
    </SafeAreaView>
    
  )
}

export default RestaurantScreen