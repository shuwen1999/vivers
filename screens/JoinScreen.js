import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect, useState, useRef, useEffect } from 'react';
import { View, Text , Button, SafeAreaView, TouchableOpacity, Image, TextInput} from 'react-native';
import useAuth from "../hooks/useAuth";
import tw from "tailwind-rn";
import { FontAwesome, Ionicons } from '@expo/vector-icons'; 
import { collection, onSnapshot, doc, setDoc, getDocs, getDoc, serverTimestamp } from 'firebase/firestore';
import {db} from "../firebase";

const JoinScreen = () => {
    const navigation = useNavigation();
    const {user} = useAuth();
    const [userid, setUserid] = useState(null);
    const [sessionid, setSessionid] = useState(null);

    
    const enterMatch = async() => {
        // add a document in user which same session id
        const sessionId = sessionid;
        const creatorId = userid;
        
        //const loggedInProfile = await( await getDoc(doc(db,"users",user.uid))).data(); 
        
        //console.log("my userid is "+ user.uid + " creator is "+ creatorId);
        
        

        const sessionRef = doc(db, "users", userid, "sessions", sessionId);
        const sessionSnap = await getDoc(sessionRef);

        if (sessionSnap.exists()) {
        console.log("Document data:", sessionSnap.data());
        const sessionDetails = sessionSnap.data();
        //console.log("session details are " + sessionDetails.location);

        navigation.navigate("Swipev2",{
            sessionDetails,
            creatorId,
            sessionId
        });

        } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
        }

        
        
        
    };

    return (
        <SafeAreaView>
            {/* header */}
            <View style={tw('flex-row items-center justify-around relative top-10')}>
                <TouchableOpacity>
                    <Ionicons name="home" size={30} color="#FD7656" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Swipe")}>
                    <Ionicons name="chatbubbles" size={30} color="grey" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                    <FontAwesome name="user" size={30} color="grey" />
                </TouchableOpacity>
            </View>

            <Text></Text>
            <View style={tw("ml-4 mt-16")}>
                <Text style={tw("text-base p-4 mt-20")}>Join Match</Text>
            </View>
            
            <View>
                <TextInput
                    onChangeText={(val)=>setUserid(val)}
                    style={[tw("text-center py-2 px-8  top-4"),{backgroundColor:"#E2E8F0", color:"#BDBDBD"}]}
                />
                
                <TextInput
                //value={sessionid}
                onChangeText={(val)=>setSessionid(val)}
                    style={[tw("text-center py-2 px-8  top-4"),{backgroundColor:"#E2E8F0", color:"#BDBDBD"}]}
                    placeholder="Session ID"
                
                />

                <TouchableOpacity 
                //disabled={!userid || !sessionid}
                style={tw("w-full p-3 rounded-xl absolute top-28")}
                //userid? {backgroundColor:"#FD7656"}: {backgroundColor:"grey"}]
                onPress={enterMatch}
                >
                    <Text style={tw("text-center text-white text-base")}>Enter match</Text>
                </TouchableOpacity>
            </View>
            
        </SafeAreaView>
    );
};
export default JoinScreen; 
 