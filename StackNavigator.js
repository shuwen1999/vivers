import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from './screens/LoginScreen';
import ChatScreen from './screens/ChatScreen';
import HomeScreen from './screens/HomeScreen';
import useAuth from './hooks/useAuth';
import ProfileScreen from './screens/ProfileScreen';
import SwipeScreen from './screens/SwipePage';
import { startClock } from 'react-native-reanimated';
import ModalScreen from './screens/ModalScreen';
import UserDetailsScreen from './screens/UserDetails';
import FriendScreen from './screens/FriendScreen';
import LocationScreen from './screens/LocationScreen';
import JoinScreen from './screens/JoinScreen';
import MessageScreen from './screens/MessageScreen';
import SwipeScreenv2 from './screens/SwipeScreenv2';
import MatchScreen from './screens/MatchScreen';
import RestaurantScreen from './screens/RestaurantScreen';
import ListLocation from './screens/ListLocation';
import ListRestaurant from './screens/ListRestaurant';
import BookmarkScreen from './screens/BookmarkScreen';
import MatchList from './screens/MatchList';
import {setDoc, doc, serverTimestamp} from 'firebase/firestore';
import {db} from "./firebase";
import AllMatchesScreen from './screens/AllMatchesScreen';
import MatchDetails from './screens/MatchDetails';
const Stack = createNativeStackNavigator();

const StackNavigator = () => {
    const {user} = useAuth();

    if (user){
        setDoc(doc(db, "users", user.uid), {
            id:user.uid,
            displayName: user.displayName,
            ogURL:user.photoURL,
            timestamp: serverTimestamp()
          })
    }
   
    return (
        <Stack.Navigator
        screenOptions={{
            headerShown:false,
        }}
        >
        {user?(
            
            <Stack.Group>
                <Stack.Screen name="Chat" component={ChatScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                {/* <Stack.Screen name="Join" component={JoinScreen}/> */}
                <Stack.Screen name="Friend" component={FriendScreen}/>
                <Stack.Screen name="Modal" component={ModalScreen}/>
                <Stack.Screen name="Message" component={MessageScreen} />
                <Stack.Screen name="Swipev2" component={SwipeScreenv2}/>
                <Stack.Screen name="Swipe" component={SwipeScreen} />
                <Stack.Screen name="Restaurant" component={RestaurantScreen}/>
                <Stack.Screen name="Location" component={LocationScreen}/>
                <Stack.Screen name="Match" component={MatchScreen}/>
                <Stack.Screen name="ListLocation" component={ListLocation}/>
                <Stack.Screen name="ListRestaurant" component={ListRestaurant}/>
                <Stack.Screen name="Bookmark" component={BookmarkScreen}/>
                <Stack.Screen name="MatchList" component={MatchList}/>
                <Stack.Screen name="UserDetails" component={UserDetailsScreen}/>
                <Stack.Screen name="AllMatches" component={AllMatchesScreen}/>
                <Stack.Screen name="MatchDetails" component={MatchDetails}/>
            </Stack.Group>
            
            
            
        )   :   (
            <>
            <Stack.Screen name="Login" component={LoginScreen} />
            
            </>
        )}            
            
        </Stack.Navigator>
    )
}

export default StackNavigator
