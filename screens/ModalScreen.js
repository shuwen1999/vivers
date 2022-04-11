import React, {useEffect} from 'react'
import { SafeAreaView, View, Text, ImageBackground, TouchableOpacity, Image, Touchable } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import tw from "tailwind-rn";
import useAuth from '../hooks/useAuth';
import {Ionicons, MaterialIcons, Entypo, MaterialCommunityIcons} from '@expo/vector-icons';

const ModalScreen = () => {
    //const {signInWithGoogle, loading, user} = useAuth();
    const navigation = useNavigation();
    const {params} = useRoute();
    const {cards} = params;

    useEffect(()=> {
        let unsub;

                
        const fetchCards = async() =>{
            unsub = onSnapshot(query(collectionGroup(db, "eateries"),where("Name", "==", cards.Name)), (snapshot) => {
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
                source={{uri:cards.Image}}
            />

            
        </View>
        <View>
            <Text
                style={tw("text-lg font-bold text-center mt-20 mb-8")}
            >{cards.Name}</Text>
            
            
            
            <View style={tw("flex-row items-center mx-4 mb-2")}>
                <Entypo name="location-pin" size={24} color="red" />
                <Text>{cards.Branches}</Text>
            </View>
            
            <View style={tw("flex-row items-center mx-4 mb-2")}>
                <MaterialIcons name="call" size={24} color="red" />
                <Text>{cards.Phone}</Text>
            </View>
            
            <View style={tw("flex-row items-center mx-4 mb-2")}>
                <MaterialCommunityIcons name="clock" size={24} color="red" />
                <Text>{cards.Opening}</Text>
            </View>
            
            
            <Text style={tw("mx-4")}>
            {cards.Desc}
            </Text>
        </View>
    </SafeAreaView>
    )
}

export default ModalScreen
