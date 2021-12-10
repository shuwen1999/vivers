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
                <TouchableOpacity>
                    <Ionicons name="home" size={30} color="grey" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
                    <Ionicons name="chatbubbles" size={30} color="grey" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                    <FontAwesome name="user" size={30} color="#FD7656" />
                </TouchableOpacity>

            </View>

            <View style={tw("relative mt-10 items-center")}>
                <Text>Welcome {user.displayName}</Text>
                
                {/* <TouchableOpacity style={tw("absolute left-5 top-3")}>
                    
                </TouchableOpacity> */}
            </View>

            {/* end of header */}

            <Image 
                        style={tw("h-10 w-10 rounded-full")}
                        source={{uri: user.photoURL}}
                    />
            
            
            <Button 
                title="Go to Home Screen" 
                onPress={() => navigation.navigate("Home")}
            />
            {/* <Button title="Logout" onPress={logout}/> */}
        </SafeAreaView>
    );
};

export default ProfileScreen
 