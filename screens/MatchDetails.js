import { View, Text , Button, SafeAreaView, TouchableOpacity, Image, ScrollView, FlatList, StyleSheet} from 'react-native'
import React, {useEffect, useState} from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import { onSnapshot, collection, doc, orderBy } from 'firebase/firestore';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons'; 
import tw from "tailwind-rn";
import {db} from '../firebase';
import Card from '../Components/Card';
const AllMatchesScreen = () => {
    const navigation = useNavigation();
    const [matches, setMatches] = useState([])
    const {params} = useRoute();
    const {chosenSession, friendDetails} = params;

    useEffect(()=> {
        let unsub;
        const fetchCards = async() =>{
            unsub = onSnapshot(collection(db, "friends", friendDetails.id, "sessions", chosenSession.sessionId, "matched"), (snapshot) => {
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
        
        const chosenRestaurant = item;
        console.log(chosenRestaurant.Name);
        navigation.navigate("Restaurant",{
            chosenRestaurant
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
                
                <Text style={[tw("text-lg ml-24"),{fontFamily: 'OleoScript_700Bold'}]}>Matches</Text>
            </View>
                
            <View>
                
                <View style={tw("my-2")}>
                   
                <FlatList
                    data={matches}
                    keyExtractor = {(item,index)=>index.toString()}
                    numColumns={2}
                    ListFooterComponent={<View style={{height: 100}}/>}
                    renderItem={({item, index})=> item? (
                    
                    <TouchableOpacity  
                        style={{flexDirection:'row', alignItems:'center', backgroundColor: item.selected?'orange':'white'}}
                        onPress={() => onClickItem(item,index)}
                        
                    >
                        <Card
                            
                            > 
                                <Image
                                    style={tw(" h-32 w-32")}
                                    source={{uri:item.Image}}
                                    
                                />
                                <Text key={item.id}>{item.Name}</Text>
                                
                            </Card>
                       
                    </TouchableOpacity>):(
                        <TouchableOpacity  
                        style={{flexDirection:'row', alignItems:'center', backgroundColor: item.selected?'orange':'white'}}
                        onPress={() => onClickItem(item,index)}
                        
                    >
                        <Card
                            
                            > 
                                <Image
                                    style={tw(" h-32 w-32")}
                                    source={{uri:item.Image}}
                                    
                                />
                                <Text>no matches</Text>
                                
                            </Card>
                       
                    </TouchableOpacity>
                    )
                }
               />
            </View>
               
                
            </View>    
            
            
        </SafeAreaView>
  )
}

export default AllMatchesScreen