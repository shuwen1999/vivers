import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useLayoutEffect, useEffect, useState } from 'react';
import { View, Text , Button, SafeAreaView, TouchableOpacity, Image, ScrollView, FlatList, StyleSheet} from 'react-native';
import useAuth from "../hooks/useAuth";
import tw from "tailwind-rn";
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons'; 
import RestaurantItem from '../Components/RestaurantItem';
import { collectionGroup, query, onSnapshot, doc, setDoc, getDoc, serverTimestamp, collection } from 'firebase/firestore';
import {db} from "../firebase";

const BookmarkScreen = () => {
    const navigation = useNavigation();
    const {user} = useAuth();
    const [restaurant, setRestaurant] = useState();

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

    return (
        <SafeAreaView>
            {/* header */}
            <View style={tw('flex-row items-center justify-around relative top-16')}>
                <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                    <Ionicons name="home" size={30} color="#FD7656" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
                    <Ionicons name="chatbubbles" size={30} color="grey" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                    <FontAwesome name="user" size={30} color="grey" />
                </TouchableOpacity>
            </View>
            <Text style={tw("mt-20 text-lg font-bold left-10")}>All Bookmarked</Text>
            <View>
                
                <View style={tw("my-4")}>
                   
                <FlatList
                    data={restaurant}
                    keyExtractor = {(item,index)=>index.toString()}
                    renderItem={({item, index})=> item? (
                    
                    <TouchableOpacity  
                        style={{flexDirection:'row', alignItems:'center', backgroundColor: item.selected?'orange':'white'}}
                        onPress={() => onClickItem(item,index)}
                        
                    >
                        <Image
                            style={tw(" h-20 w-20 mr-4")}
                            source={{uri:item.Image}}
                            
                        />
                        <Text style={styles.item}key={item.id}>{item.Name}</Text>
                        <MaterialIcons name="navigate-next" size={24} color="black" />
                        
                       
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
      height: 44
    },
  });