import React, {useState} from 'react'
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import tw  from 'tailwind-rn';
import {Ionicons, FontAwesome} from '@expo/vector-icons';
import ChatList from '../Components/ChatList';

const ChatScreen = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView>
            {/* header */}
            <View style={tw('flex-row items-center justify-around relative top-16')}>
                <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                    <Ionicons name="home" size={30} color="grey" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
                    <Ionicons name="chatbubbles" size={30} color="#FD7656" />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.navigate("Friend")}>
                    <FontAwesome name="user" size={30} color="grey" />
                </TouchableOpacity>
            </View>
            <ChatList/>
        </SafeAreaView>
    )
}

export default ChatScreen
