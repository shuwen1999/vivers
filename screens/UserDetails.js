import React from 'react'
import { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Platform, StyleSheet } from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import tw from "tailwind-rn";
import useAuth from "../hooks/useAuth";
import { AntDesign, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { serverTimestamp, setDoc, doc, collection, query, getDoc} from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import {db} from "../firebase";
import { backgroundColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';

const UserDetailsScreen = () => {
    const {user} = useAuth();
    const [image, setImage] = useState(null);
    const [username, setUsername] = useState(null);
    const navigation = useNavigation();
    const [profiles, setProfiles] = useState([]);
    
    //const loggedInProfile = await(await getDoc(doc(db,"users",user.uid)).data());

    

    const updateUserProfile = () =>{
        setDoc(doc(db, "users", user.uid),{
            id:user.uid,
            displayName: user.displayName,
            newName: username,
            ogURL:user.photoURL,
            photoURL:image,
            timestamp: serverTimestamp()
        }).then(()=>{
            navigation.navigate("Home");
        }).catch((error) => {
            alert(error.message);
        });
    };
    useEffect(() => {
        checkForCameraRollPermission()

        let unsub;

        const fetchCards = async() =>{
            unsub = onSnapshot(collection(db, "users"), (snapshot) => {
                setProfiles(
                    snapshot.docs.map((doc) =>({
                        id: doc.id,
                        ...doc.data(),
                    }))
                );
            });
        };
        fetchCards();
        return unsub;
      }, []);
    const addImage = async () => {
            let _image = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4,3],
            quality: 1,
        });
        console.log(JSON.stringify(_image));

        if (!_image.cancelled) {
        setImage(_image.uri);
        }
    };
    const  checkForCameraRollPermission=async()=>{
        const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          //alert("Please grant camera roll permissions inside your system's settings");
        }else{
          console.log('Media Permissions are granted');
          status='granted';
        };
      
    };
    

    return (
        
        

        <View style={tw("relative mt-20 items-center h-5/6")}>
            {/* user image, default is google image, can edit image to personalise */}
            <View style={imageUploaderStyles.container}>
                {image?
                
                <Image source={{ uri: image }} style={{ width: 150, height: 150 }} />
                :
                <Image 
                style={[tw("rounded-full"),{width: 150, height: 150}]}
                source={{uri: user.photoURL}}
            />  
            
            }
                
               {/* edit image text */}
                <View style={imageUploaderStyles.uploadBtnContainer}>
                    <TouchableOpacity onPress={addImage} style={imageUploaderStyles.uploadBtn} >
                        <Text>Edit Image</Text>
                        <AntDesign name="camera" size={20} color="black" />
                    </TouchableOpacity>
                </View>
              

            </View>
            
            {user.newName?
                // getDoc(doc(db,"users",user.newName)).then(
                //     (documentSnapshot)=>{
                //         if (documentSnapshot.exists()){
                            
                //         }
                //     }
                // )
                                
                <Text style={tw("text-xl font-bold p-4")}>{user.newName}</Text>
                :
                
                
                <Text style={tw("text-xl font-bold p-4")}>{user.displayName}</Text>
            }
            
            {/* <Text style={tw("text-xl font-bold p-4")}>{user.displayName}</Text> */}
            
            <TextInput
            value={username}
            onChangeText={(text) => setUsername(text)} 
                style={[tw("text-center py-2 px-8  "),{backgroundColor:"#E2E8F0", color:"#BDBDBD"}]}
                placeholder="Update Username"
            
            />

            {/* saved locations */}
            <TouchableOpacity style={{flexDirection:'row', alignItems:'center', left: 0, marginTop:10}} onPress={() => navigation.navigate("Profile")}>
                <View style={{padding: 5, margin:5, width:35, backgroundColor:"#FCA241"}}>
                    <Ionicons name="bookmarks" size={24} color="white" /> 
                </View>
                
                <Text>Bookmarks</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{flexDirection:'row', alignItems:'center',justifyContent: 'space-around' }} onPress={() => navigation.navigate("Profile")}>
                <View style={{padding: 5, margin:5,width:35,backgroundColor:"#51AAF5"}}>
                    <Ionicons name="checkmark-circle-sharp" size={24} color="white" />
                </View>
                <Text>Visited</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{flexDirection:'row', alignItems:'center'}} onPress={() => navigation.navigate("Profile")}>
                
                <View style={{padding: 5, margin:5,width:35,backgroundColor:"#BB6BD9"}}>
                <FontAwesome5 name="fire" size={24} color="white" />
                </View>
                <Text>Session Matches</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{flexDirection:'row', alignItems:'center',left: 0}} onPress={() => navigation.navigate("Profile")}>
                <View style={{padding: 5, margin:5,width:35,backgroundColor:"#15C7BC"}}>
                    <Ionicons name="ios-chatbubbles" size={24} color="white" />
                </View>
                <Text>Message</Text>
            </TouchableOpacity>

            

            {/* update profile name */}
            <TouchableOpacity 
            disabled={!username}
            style={[tw("w-64 p-3 rounded-xl absolute bottom-10"),
            username? {backgroundColor:"#FD7656"}: {backgroundColor:"grey"}]}
            onPress={updateUserProfile}
            >
                <Text style={tw("text-center text-white text-base")}>Update Profile</Text>
            </TouchableOpacity>
            
            
        </View>
    );
}

const imageUploaderStyles=StyleSheet.create({
    container:{
        elevation:2,
        height:150,
        width:150, 
        backgroundColor:'#efefef',
        position:'relative',
        borderRadius:999,
        overflow:'hidden',
    },
    uploadBtnContainer:{
        opacity:0.7,
        position:'absolute',
        right:0,
        bottom:0,
        backgroundColor:'lightgrey',
        width:'100%',
        height:'25%',
    },
    uploadBtn:{
        display:'flex',
        alignItems:"center",
        justifyContent:'center'
    }
})
export default UserDetailsScreen
