import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useLayoutEffect, useEffect, useState } from 'react';
import { View, Text , Button, SafeAreaView, TouchableOpacity, Image, ScrollView, FlatList, StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard} from 'react-native';
import useAuth from "../hooks/useAuth";
import tw from "tailwind-rn";
import { FontAwesome, Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons'; 
import RestaurantItem from '../Components/RestaurantItem';
import { collectionGroup, query, onSnapshot, doc, setDoc, getDoc, serverTimestamp, collection } from 'firebase/firestore';
import {db} from "../firebase";
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import { 
    useFonts,
    OleoScript_400Regular,
    OleoScript_700Bold 
  } from '@expo-google-fonts/oleo-script'
const MatchList = () => {
    const navigation = useNavigation();
    const {user, signInWithGoogle} = useAuth();
    const [restaurant, setRestaurant] = useState([]);
    const [sessionid, setSessionid] = useState(null);
    const {params} = useRoute();
    const {friendDetails} = params;
    let [fontsLoaded] = useFonts({
        
        OleoScript_700Bold 
      });

      const enterMatch = async() => {
        const sessionId = sessionid;
        const creatorId = getMatchedUserInfo(friendDetails.users, user.uid).id;
        

        const sessionRef = doc(db, "users", creatorId, "sessions", sessionId);
        const sessionSnap = await getDoc(sessionRef);

        if (sessionSnap.exists()) {
        console.log("Document data:", sessionSnap.data());
        const sessionDetails = sessionSnap.data();
        //console.log("session details are " + sessionDetails.location);

        navigation.navigate("Swipev2",{
            sessionDetails,
            creatorId,
            sessionId,
            friendDetails
        });

        } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        }
  
    };

    //console.log(getMatchedUserInfo(friendDetails.users,user.uid).displayName);
    return (
        <SafeAreaView>
            {/* header */}
            <View style={tw('flex-row py-2 relative mt-10 items-center bg-gray-200')}>
                <TouchableOpacity style={tw("pl-6")}
                    onPress={()=> navigation.goBack()}
                >
                <Ionicons name="chevron-back" size={30} color="black" />
                </TouchableOpacity>
                
                <Text style={[tw("text-lg ml-24"),{fontFamily: 'OleoScript_700Bold'}]}>Matches</Text>
            </View>

            {/* user photos */}
            <View style={tw("flex-row justify-center mt-16 items-center")}>
                <Image
                style={tw("h-20 w-20 rounded-full")}
                source={{uri:user.photoURL}}
                />

                <Entypo name="cross" size={24} color="black" />

                <Image
                style={tw("h-20 w-20 rounded-full")}
                source={{uri:getMatchedUserInfo(friendDetails.users, user.uid)?.ogURL}}
                />
            
            </View>
            
            {/* match options */}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={tw("items-center")}>
            
                <View style={tw("items-center top-8")}>
                <Text>To Join Match:</Text>
                <View style={tw("flex-row top-4")}>
                    
                    <TextInput
                        onChangeText={(val)=>setSessionid(val)}
                        style={[tw("rounded-2xl w-52 px-4 py-2 h-12 my-2 mx-2"),{backgroundColor:"#E2E8F0", color:"#BDBDBD"}]}
                        placeholder="Session ID"
                    
                    />
                    
                    <TouchableOpacity 
                    
                    style={[
                        tw("rounded-full items-center w-12 h-12 my-2 pt-3 pl-1"),{backgroundColor: "#FD7656"},]}
                        onPress={enterMatch}>
                        {/* <Text style={[tw("text-center text-white")]}>Join</Text> */}
                        <MaterialIcons name="arrow-forward-ios" size={20} color="white" />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity 
                style={[
                    tw("w-52 p-4 rounded-2xl top-8"), 
                    {marginTop:10,backgroundColor: "#FD7656"},
                ]}
                onPress={()=> navigation.navigate("Location",{
                    friendDetails
                })}
                >
                    <Text 
                        style={tw("font-semibold text-center text-white")} 
                        >Start Match</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                style={[
                    tw("w-52 p-4 rounded-2xl top-8"), 
                    {marginTop:10,backgroundColor: "#FD7656"},
                ]}
                onPress={()=> navigation.navigate("AllMatches",{friendDetails})}
                >
                    <Text 
                        style={tw("font-semibold text-center text-white")} 
                        >View All Matches</Text>
                </TouchableOpacity>
            </View>
            
            </View>
            </TouchableWithoutFeedback>
            
            
        </SafeAreaView>
    );
};

export default MatchList; 
 
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