import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';
import { View, Text , Button, SafeAreaView, TouchableOpacity, Image} from 'react-native';
import userAuth from '../hooks/useAuth';
import tw from "tailwind-rn";

const ProfileScreen = () => {
    const navigation = useNavigation();
    const {user, logout} = userAuth();
    

    return (
        <SafeAreaView>
            {/* header */}
            
            <View style={tw("mt-8")}>
                <TouchableOpacity style={tw("absolute left-5 top-3")}>
                    <Image 
                        style={tw("h-50 w-50 rounded-full")}
                        source={{uri: user.photoURL}}
                    />
                    
                </TouchableOpacity>
            </View>

            {/* end of header */}
            
            {/* <Text>I am the profilescreen</Text>
            <Button 
                title="Go to Home Screen" 
                onPress={() => navigation.navigate("Home")}
            />
            <Button title="Logout" onPress={logout}/> */}
        </SafeAreaView>
    );
};

export default ProfileScreen
 