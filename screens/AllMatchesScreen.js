import { View, Text , Button, SafeAreaView, TouchableOpacity, Image, ScrollView, FlatList, StyleSheet} from 'react-native'
import React, {useEffect, useState} from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { onSnapshot, collection, doc, orderBy } from 'firebase/firestore';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons'; 
import tw from "tailwind-rn";
import {db} from '../firebase';
const AllMatchesScreen = () => {
    const navigation = useNavigation();
    const [matches, setMatches] = useState([])
    const {params} = useRoute();
    const {friendDetails} = params;

    useEffect(()=> {
        let unsub;
        const fetchCards = async() =>{
            unsub = onSnapshot(collection(db, "friends", friendDetails.id, "sessions"),orderBy('timestamp'), (snapshot) => {
                setMatches(
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
    const onClickItem = async(item,index) => {
        
        const chosenSession = item;
        navigation.navigate("MatchDetails",{
            chosenSession,
            friendDetails
        });
    }
  return (
    <SafeAreaView >
            {/* header */}
            
            <View style={tw('flex-row py-2 relative mt-10 items-center bg-gray-200')}>
                <TouchableOpacity style={tw("pl-6")}
                    onPress={()=> navigation.goBack()}
                >
                <Ionicons name="chevron-back" size={30} color="black" />
                </TouchableOpacity>
                
                <Text style={[tw("text-lg ml-12"),{fontFamily: 'OleoScript_700Bold'}]}>All Match Sessions</Text>
            </View>
                
            <View>
                
                <View style={tw("my-2")}>
                   
                <FlatList
                    data={matches}
                    keyExtractor = {(item,index)=>index.toString()}
                    renderItem={({item, index})=> item? (
                    
                    <TouchableOpacity
                        style={[tw("flex-row items-center py-4 px-5 bg-white mx-3 my-1 rounded-lg"),{flexDirection:'row', alignItems:'center', backgroundColor: item.selected?'orange':'white'}]}
                        onPress={() => onClickItem(item,index)}
                        
                    >
                        <Text>{item.sessionId}: {item.location}</Text>
                       
                    </TouchableOpacity>):(
                        <Text>no data</Text>
                    )
                }
               />
            </View>
               
                
            </View>    
            
            
        </SafeAreaView>
  )
}

export default AllMatchesScreen