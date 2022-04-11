import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect, useEffect, useState } from 'react';
import { View, Text , Button, SafeAreaView, TouchableOpacity, Image, ScrollView, FlatList, StyleSheet} from 'react-native';
import useAuth from "../hooks/useAuth";
import tw from "tailwind-rn";
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons'; 
import RestaurantItem from '../Components/RestaurantItem';
import { collectionGroup, query, onSnapshot, doc, setDoc, getDoc, serverTimestamp, collection } from 'firebase/firestore';
import {db} from "../firebase";
import Card from '../Components/Card';

const ListLocation = () => {
    const navigation = useNavigation();
    const {user, signInWithGoogle} = useAuth();
    const [malls, setMalls] = useState([]);
    const options = [
        { label: "Restaurants", value: "Home" },
        { label: "Location", value: "ListLocation" },
      ];
    useEffect(()=> {
        let unsub;

                
        const fetchCards = async() =>{
            unsub = onSnapshot(collectionGroup(db, "malls"), (snapshot) => {
                setMalls(
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
        
        const chosenMall = item;
        console.log(chosenMall.Name);
        navigation.navigate("ListRestaurant",{
            chosenMall
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
            {/* <Text style={tw("my-20 text-lg font-bold left-10")}>All Restaurants</Text> */}
            <View>
                
                <View style={tw("my-16")}>
                    <View>
                        <View style={tw('flex-row items-center relative mx-8 mb-3 mt-5 rounded-full bg-gray-300 w-6/12')}>
                        <TouchableOpacity onPress={()=>navigation.navigate("Home")}>
                             <Text style={tw("px-4 text-black")}>
                                Restaurants
                                {/* <Ionicons name="restaurant-outline" size={24} color="black" /> */}
                            </Text>
                            </TouchableOpacity>
                            
                                <Text style={[tw("px-4 py-2 mr-2 text-white rounded-full font-bold"),{backgroundColor:"#FD7656"}]}>
                                    Location
                                    {/* <Ionicons name="location-outline" size={16} color="black" /> */}
                                </Text>
                            
                        </View>
                           
                    </View>
                    
                
                    <FlatList
                        data={malls}
                        keyExtractor = {(item,index)=>index.toString()}
                        numColumns={2}
                        ListFooterComponent={<View style={{height: 100}}/>}
                        renderItem={({item, index})=> item? (
                        
                        <TouchableOpacity  
                            style={{flexDirection:'row', alignItems:'center', backgroundColor: item.selected?'orange':'white'}}
                            onPress={() => onClickItem(item,index)}
                            
                        >
                            <Card> 
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

export default ListLocation; 
 
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