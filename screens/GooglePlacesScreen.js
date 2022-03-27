// import { useNavigation } from '@react-navigation/native';
// import React, { useLayoutEffect } from 'react';
// import { View, Text , Button, SafeAreaView, TouchableOpacity, Image} from 'react-native';
// import useAuth from "../hooks/useAuth";
// import tw from "tailwind-rn";
// import { FontAwesome, Ionicons } from '@expo/vector-icons'; 
// import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
// import {GOOGLE_MAPS_APIKEY} from '@env';

// const GooglePlacesScreen = () => {
//     const navigation = useNavigation();
//     const {user, logout, signInWithGoogle} = useAuth();
    
//     return (
//         <SafeAreaView>
//             {/* header */}
//             <View style={tw('flex-row items-center justify-around relative top-10')}>
//                 <TouchableOpacity>
//                     <Ionicons name="home" size={30} color="#FD7656" />
//                 </TouchableOpacity>

//                 <TouchableOpacity onPress={() => navigation.navigate("Swipe")}>
//                     <Ionicons name="chatbubbles" size={30} color="grey" />
//                 </TouchableOpacity>

//                 <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
//                     <FontAwesome name="user" size={30} color="grey" />
//                 </TouchableOpacity>
//             </View>
//             <View style={tw("ml-4 mt-15 bg-grey")}>
//                 <Text style={tw("text-xl font-bold p-4 mt-20")}>Location</Text>
//                 <GooglePlacesAutocomplete
//                     placeholder='Which Mall?'
//                     styles={{
//                         container:{
//                             flex:0,
//                         },
//                         textInput:{
//                             fontSize:18,
//                         },
//                     }}
                    
//                     onPress={(data,details=null)=>{
//                         console.log(data)
//                         console.log(details)
//                         const mall = data.description.split(',')[1]
//                         console.log(mall)
//                     }}
//                     fetchDetails={true}
                    
//                     enablePoweredByContainer={false}
//                     query={{
//                         key:GOOGLE_MAPS_APIKEY,
//                         language:"en",
//                     }}
                    
//                     nearbyPlacesAPI='GooglePlacesSearch'
//                     debounce={400}
//                 />
//             </View>
            
            
//         </SafeAreaView>
//     );
// };

// export default GooglePlacesScreen; 
 