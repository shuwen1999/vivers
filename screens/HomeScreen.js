import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';
import { View, Text , Button, SafeAreaView, TouchableOpacity, Image} from 'react-native';
import userAuth from '../hooks/useAuth';
import tw from "tailwind-rn";
import { FontAwesome, Ionicons } from '@expo/vector-icons'; 

const HomeScreen = () => {
    const navigation = useNavigation();
    const {user, logout} = userAuth();

    return (
        <SafeAreaView>
            {/* header */}
            <View style={tw('flex-row items-center; justify-around relative top-10')}>
                <TouchableOpacity>
                    <Ionicons name="home" size={30} color="#FD7656" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Modal")}>
                    <Ionicons name="chatbubbles" size={30} color="grey" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
                    <FontAwesome name="user" size={30} color="grey" />
                </TouchableOpacity>

            </View>
            
            

            

            {/* end of header */}
            
            {/* <Text>I am the homescreen</Text>
            <Button 
                title="Go to Profile Screen" 
                onPress={() => navigation.navigate("Profile")}
            />
            <Button title="Logout" onPress={logout}/> */}
        </SafeAreaView>
    )
}

export default HomeScreen
 