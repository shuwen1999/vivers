import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useLayoutEffect, useEffect, useState } from 'react';
import { View, Text , Button, SafeAreaView, TouchableOpacity, Image, ScrollView, FlatList, StyleSheet} from 'react-native';
import useAuth from "../hooks/useAuth";
import tw from "tailwind-rn";
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons'; 
import RestaurantItem from '../Components/RestaurantItem';
import { collectionGroup, query, onSnapshot, doc, setDoc, getDoc, serverTimestamp, collection } from 'firebase/firestore';
import {db} from "../firebase";
//import { useFonts } from 'expo-font';
import Card from '../Components/Card';
import { 
    OleoScript_400Regular,
    OleoScript_700Bold, useFonts 
  } from '@expo-google-fonts/oleo-script'

const BookmarkScreen = () => {
    const navigation = useNavigation();
    const {user} = useAuth();
    const [restaurant, setRestaurant] = useState();
    let [fontsLoaded] = useFonts({
        OleoScript_700Bold 
      });

    useEffect(()=> {
        let unsub;
        const fetchCards = async() =>{
            unsub = onSnapshot(collection(db, "users", user.uid, "bookmarked"), (snapshot) => {
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

    const onClickItem = async(item,index) => {
        
        const chosenRestaurant = item;
        console.log(chosenRestaurant.Name);
        navigation.navigate("Restaurant",{
            chosenRestaurant
        });
    }
    if(!fontsLoaded){return null;}

    return (
        <SafeAreaView >
            {/* header */}
            
            <View style={tw('flex-row py-2 relative mt-10 items-center bg-gray-200')}>
                <TouchableOpacity style={tw("pl-6")}
                    onPress={()=> navigation.goBack()}
                >
                <Ionicons name="chevron-back" size={30} color="black" />
                </TouchableOpacity>
                
                <Text style={[tw("text-lg ml-16"),{fontFamily: 'OleoScript_700Bold'}]}>All Bookmarked</Text>
            </View>
                
            <View>
                
                <View style={tw("my-2")}>
                   
                <FlatList
                    data={restaurant}
                    numColumns={2}
                    ListFooterComponent={<View style={{height: 100}}/>}
                    keyExtractor = {(item,index)=>index.toString()}
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
                                <Text style={styles.item}key={item.id}>{item.Name}</Text>
                                
                            </Card>
                        
                       
                    </TouchableOpacity>):(
                        <Text>no data</Text>
                    )
                }
               />
            </View>
               
                
            </View>    
            
            
        </SafeAreaView>
    );
};

export default BookmarkScreen; 
 
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