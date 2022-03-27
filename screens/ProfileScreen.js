import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect, useState, useEffect } from 'react';
import { View, Text , Button, SafeAreaView, TouchableOpacity, Image} from 'react-native';
import useAuth from '../hooks/useAuth';
import tw from "tailwind-rn";
import { FontAwesome, Ionicons } from '@expo/vector-icons'; 
import { collection, onSnapshot, doc } from 'firebase/firestore';
import {db} from "../firebase";

const ProfileScreen = () => {
    const navigation = useNavigation();
    const {user, logout} = useAuth();
    console.log(user.displayName);
    const [profiles, setProfiles] = useState([]);

    useEffect(()=> {
        let unsub;

        const fetchCards = async() =>{
            unsub = onSnapshot(collection(db, "users"), (snapshot) => {
                setProfiles(
                    snapshot.docs.map((doc) =>({
                        id: doc.id,
                        ...doc.data(),
                    }))
                );
            });
        };
        fetchCards();
        return unsub;
    },[])

    return (
        <SafeAreaView>
            
            {/* header */}
            <View style={tw('flex-row items-center justify-around relative top-16')}>
                <TouchableOpacity onPress={()=> navigation.navigate("Home")}>
                    <Ionicons name="home" size={30} color="grey" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
                    <Ionicons name="chatbubbles" size={30} color="grey" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                    <FontAwesome name="user" size={30} color="#FD7656" />
                </TouchableOpacity>

            </View>
            {/* end of header */}
            
            <View style={tw("relative mt-20 items-center")}>
                <Image 
                    style={tw("h-32 w-32 rounded-full")}
                    source={{uri: user.photoURL}}
                />
                <Text style={tw("mt-10 text-base text-black")}>{user.displayName}</Text>
                
                

                <TouchableOpacity 
                style={[
                    tw("w-52 p-4 rounded-2xl top-10"), 
                    {marginHorizontal: "25%", backgroundColor: "#FD7656"},
                ]}
                onPress={()=> navigation.navigate("UserDetails")}
                >
                    {/* not showing user.newName as not data is not realtime */}
                    <Text 
                        style={tw("font-semibold text-center text-white")} 
                        >Quick Match</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                style={[
                    tw("w-52 p-4 rounded-2xl top-10"), 
                    {marginTop:10,marginHorizontal: "25%", backgroundColor: "#FD7656"},
                ]}
                onPress={()=> navigation.navigate("Friend")}
                >
                    {/* not showing user.newName as not data is not realtime */}
                    <Text 
                        style={tw("font-semibold text-center text-white")} 
                        >Match with Friends</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                style={[
                    tw("w-52 p-4 rounded-2xl top-10"), 
                    {marginTop:10,marginHorizontal: "25%", backgroundColor: "#FD7656"},
                ]}
                onPress={()=> navigation.navigate("Join")}
                >
                    {/* not showing user.newName as not data is not realtime */}
                    <Text 
                        style={tw("font-semibold text-center text-white")} 
                        >Join Match</Text>
                </TouchableOpacity>

                <View>
                    <TouchableOpacity onPress={()=>navigation.navigate("Bookmark")} 
                    style={[
                        tw("w-52 p-4 rounded-2xl top-10"), 
                        {marginTop:10,marginHorizontal: "25%", backgroundColor: "#FD7656"},
                    ]}>
                        <Text style={tw("font-semibold text-center text-white")} >Bookmarked</Text>
                    </TouchableOpacity>
                </View>
                
                <View>
                    <TouchableOpacity onPress={logout} 
                    style={[
                        tw("w-52 p-4 rounded-2xl top-10"), 
                        {marginTop:10,marginHorizontal: "25%", backgroundColor: "gray"},
                    ]}>
                        <Text style={tw("font-semibold text-center text-white")} >Logout</Text>
                    </TouchableOpacity>
                </View>
               
            </View>
               

        </SafeAreaView>
    );
};

export default ProfileScreen
 