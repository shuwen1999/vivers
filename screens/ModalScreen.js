import React from 'react'
import { View, Text, ImageBackground, TouchableOpacity, Image, Touchable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import tw from "tailwind-rn";
import userAuth from '../hooks/useAuth';

const ModalScreen = () => {
    const {signInWithGoogle, loading, user} = userAuth();
    const navigation = useNavigation();
    
    return (
        <View style={tw("flex-1 mt-12")}>
            <ImageBackground 
            source={require('../assets/backgroundcolor.png')}
            resizeMode="cover"
            style={tw("flex-1 rounded-t-lg")}>
                <Image
                    style={tw("h-20 w-full mt-16")}
                    resizeMode="contain"
                    source={require('../assets/modalicon.png')}
                />
                 <TouchableOpacity 
                style={[
                    tw("absolute bottom-60 w-52 bg-white p-4 rounded-2xl"), 
                    {marginHorizontal: "25%"},
                ]}
                onPress={()=> navigation.goBack()}
                >
                    <Text 
                        style={tw("font-semibold text-center")} 
                        >Continue as Guest</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                style={[
                    tw("absolute bottom-40 w-52 bg-white p-4 rounded-2xl"), 
                    {marginHorizontal: "25%"},
                ]}
                onPress={signInWithGoogle}
                >
                    <Text 
                        style={tw("font-semibold text-center")} 
                        >{loading? "loading..." : "Login to Vivers"}</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    )
}

export default ModalScreen
