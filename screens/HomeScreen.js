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
import { useFonts } from 'expo-font';

const HomeScreen = () => {
    const navigation = useNavigation();
    const {user, signInWithGoogle} = useAuth();
    const [restaurant, setRestaurant] = useState([]);
    const [loaded] = useFonts({
        LoraBold: require('../assets/fonts/Lora-Bold.ttf'),
        LoraItalic: require('../assets/fonts/Lora-Italic.ttf'),
        OleoFont: require('../assets/fonts/Oleo Script.ttf'),
        OleoBold: require('../assets/fonts/Oleo Script Bold.ttf'),
      });
      

    useEffect(()=> {
        let unsub;
                
        const fetchCards = async() =>{

            // await setDoc(doc(db, "users", user.uid), {
            //     id:user.uid,
            //     displayName: user.displayName,
            //     ogURL:user.photoURL,
            //     timestamp: serverTimestamp()
            //   });

            unsub = onSnapshot(collectionGroup(db, "eateries"), (snapshot) => {
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
    if(!loaded){return null;}
    
    return (
        <SafeAreaView style={{flex:1}}>
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
            <View >
                {user
                ? 
                <View style={tw("my-16")}>
                    {/* switch views */}
                    <View>
                        <View style={tw('flex-row items-center relative mx-8 mb-3 mt-5 rounded-full bg-gray-300 w-6/12')}>
                             <Text style={[tw("px-4 py-2 mr-2 text-white rounded-full font-bold"),{backgroundColor:"#FD7656"}]}>
                                Restaurants
                                {/* <Ionicons name="restaurant-outline" size={24} color="black" /> */}
                            </Text>
                            
                            <TouchableOpacity onPress={()=>navigation.navigate("ListLocation")}>
                                <Text>
                                    Location
                                    {/* <Ionicons name="location-outline" size={16} color="black" /> */}
                                </Text>
                            </TouchableOpacity>
                        </View>
                           
                    </View>
                    
                    {/* list of restaurants */}
                <FlatList
                    data={restaurant}
                    keyExtractor = {(item,index)=>index.toString()}
                    numColumns={2}
                    ListFooterComponent={<View style={{height: 100}}/>}
                    style={{backgroundColor:'white'}}
                    renderItem={({item, index})=> item? (
                    
                    <TouchableOpacity  
                        style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}
                        onPress={() => onClickItem(item,index)}
                        
                    >
                        {/* <Image
                            style={tw(" h-20 w-20 mr-4")}
                            source={{uri:item.Image}}
                            
                        />
                        <Text style={styles.item}key={item.id}>{item.Name}</Text>
                        <MaterialIcons name="navigate-next" size={24} color="black" /> */}
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
               
                :
                <View>
                <TouchableOpacity onPress={signInWithGoogle} 
                style={[
                    tw("w-52 p-4 rounded-2xl top-16"), 
                    {marginTop:10,marginHorizontal: "25%", backgroundColor: "#BB6BD9"},
                ]}>
                    <Text style={tw("font-semibold text-center text-white")} >Login</Text>
                </TouchableOpacity>
            </View>
                  }    
            </View>    
            
            
        </SafeAreaView>
    );
};

export default HomeScreen; 
 
const styles = StyleSheet.create({
    container: {
     flex: 1,
     paddingTop: 5
    },
    item: {
      padding: 1,
      fontSize: 18,
      height: 44,
      //fontFamily: 'Times New Roman'
    },
  });