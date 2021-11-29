import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from './screens/LoginScreen';
import ChatScreen from './screens/ChatScreen';
import HomeScreen from './screens/HomeScreen';
import useAuth from './hooks/useAuth';
import ProfileScreen from './screens/ProfileScreen';
import SwipeScreen from './screens/SwipePage';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
    const {user} = useAuth();
    return (
        <Stack.Navigator
        screenOptions={{
            headerShown:false,
        }}
        >
        {user?(
            <>
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Chat" component={ChatScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="Swipe" component={SwipeScreen} />
            </>
        )   :   (
            <Stack.Screen name="Login" component={LoginScreen} />
        )}            
            
        </Stack.Navigator>
    )
}

export default StackNavigator
