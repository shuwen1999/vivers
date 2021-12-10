import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';
import { View, Text , Button, SafeAreaView, TouchableOpacity, Image} from 'react-native';
import useAuth from '../hooks/useAuth';
import tw from "tailwind-rn";
import { FontAwesome, Ionicons } from '@expo/vector-icons'; 

const ProfileScreen = () => {
    const navigation = useNavigation();
    const {user, logout} = useAuth();
    console.log(user);

    return (
        <SafeAreaView>
            
            {/* header */}
            <View style={tw('flex-row items-center; justify-around relative top-10')}>
                <TouchableOpacity onPress={()=> navigation.navigate("Home")}>
                    <Ionicons name="home" size={30} color="grey" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
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
                <Text style={tw("mt-10 text-md")}>{user.displayName}</Text>
                
                <TouchableOpacity 
                style={[
                    tw("w-52 p-4 rounded-2xl top-10"), 
                    {marginHorizontal: "25%", backgroundColor: "#FD7656"},
                ]}
                onPress={()=> navigation.navigate("UserDetails")}
                >
                    <Text 
                        style={tw("font-semibold text-center text-white")} 
                        >Select</Text>
                </TouchableOpacity>
            </View>

        </SafeAreaView>
    );
};

export default ProfileScreen
 