import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';
import { View, Text , Button, SafeAreaView, TouchableOpacity, Image} from 'react-native';
import useAuth from "../hooks/useAuth";
import tw from "tailwind-rn";
import { FontAwesome, Ionicons } from '@expo/vector-icons'; 

const HomeScreen = () => {
    const navigation = useNavigation();
    const {user, logout, signInWithGoogle} = useAuth();

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
            <View style={tw("ml-4 mt-15 bg-grey")}>
                <Text style={tw("text-xl font-bold p-4 mt-20")}>Search</Text>
            </View>
            
            <View>
                {user
                ? 
                <View>
                    <Text style={tw("mt-14 text-center")}>Already Logged In</Text>
                    <TouchableOpacity onPress={logout} style={[tw("mt-10 p-4"),{backgroundColor:"red"}]}>
                        <Text style={tw("text-center")}>logout</Text>
                    </TouchableOpacity>
                </View>
               
                :
                 <View>
                    <Text>Please log in</Text>
                    <TouchableOpacity onPress={signInWithGoogle} style={[tw("mt-20 p-4"),{backgroundColor:"green"}]}>
                        <Text>login</Text>
                    </TouchableOpacity>
                 </View>
                  }    
            </View>    
            
            
            {/* end of header */}
            
            {/* <Text>I am the homescreen</Text>
            <Button 
                title="Go to Profile Screen" 
                onPress={() => navigation.navigate("Profile")}
            />
            <Button title="Logout" onPress={logout}/> */}
        </SafeAreaView>
    );
};

export default HomeScreen; 
 