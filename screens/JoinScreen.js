// import { useNavigation, useRoute } from '@react-navigation/native';
// import React, { useLayoutEffect, useState, useRef, useEffect } from 'react';
// import { View, Text , Button, SafeAreaView, TouchableOpacity, Image, TextInput} from 'react-native';
// import useAuth from "../hooks/useAuth";
// import tw from "tailwind-rn";
// import { FontAwesome, Ionicons } from '@expo/vector-icons'; 
// import { collection, onSnapshot, doc, setDoc, getDocs, getDoc, serverTimestamp } from 'firebase/firestore';
// import {db} from "../firebase";
// import getMatchedUserInfo from '../lib/getMatchedUserInfo';

// const JoinScreen = () => {
//     const navigation = useNavigation();
//     const {user} = useAuth();
//     //const [userid, setUserid] = useState(null);
//     const [sessionid, setSessionid] = useState(null);
//     const {params} = useRoute();
//     const {friendDetails} = params;
    
//     const enterMatch = async() => {
//         const sessionId = sessionid;
//         const creatorId = getMatchedUserInfo(friendDetails.users, user.uid).id;
        

//         const sessionRef = doc(db, "users", creatorId, "sessions", sessionId);
//         const sessionSnap = await getDoc(sessionRef);

//         if (sessionSnap.exists()) {
//         console.log("Document data:", sessionSnap.data());
//         const sessionDetails = sessionSnap.data();
//         //console.log("session details are " + sessionDetails.location);

//         navigation.navigate("Swipev2",{
//             sessionDetails,
//             creatorId,
//             sessionId
//         });

//         } else {
//         // doc.data() will be undefined in this case
//         console.log("No such document!");
//         }
  
//     };

//     return (
//         <SafeAreaView>
//             {/* header */}
//             <View style={tw('flex-row py-2 relative mt-10 items-center bg-gray-200')}>
//                 <TouchableOpacity style={tw("pl-6")}
//                     onPress={()=> navigation.goBack()}
//                 >
//                 <Ionicons name="chevron-back" size={30} color="black" />
//                 </TouchableOpacity>
                
//                 <Text style={[tw("text-lg ml-20"),{fontFamily: 'OleoScript_700Bold'}]}>Join Match</Text>
//             </View>

//             <View style={tw("items-center")}>
                
//                 <Text>Key in Session ID to start matching</Text>
//                 <TextInput
//                     onChangeText={(val)=>setSessionid(val)}
//                     style={[tw("text-center py-2 px-8 top-4 rounded-lg w-7/12"),{backgroundColor:"#E2E8F0", color:"#BDBDBD"}]}
//                     placeholder="Session ID"
                
//                 />

//                 <TouchableOpacity 
//                 //disabled={!userid || !sessionid}
//                 style={tw("w-8/12 p-3 rounded-xl absolute top-28")}
//                 //userid? {backgroundColor:"#FD7656"}: {backgroundColor:"grey"}]
//                 onPress={enterMatch}
//                 >
//                     <Text style={[tw("text-center text-white text-base rounded-lg h-10 py-2"),{backgroundColor:"#FD7656"}]}>Enter match</Text>
//                 </TouchableOpacity>
//             </View>
            
//         </SafeAreaView>
//     );
// };
// export default JoinScreen; 
 