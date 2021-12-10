import React from 'react'
import { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Platform, StyleSheet } from 'react-native'
import { TextInput } from 'react-native-gesture-handler';
import tw from "tailwind-rn";
import useAuth from "../hooks/useAuth";
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const UserDetailsScreen = () => {
    const {user} = useAuth();
    useEffect(() => {
        checkForCameraRollPermission()
      }, []);
    const [image, setImage] = useState(null);
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
          alert("Please grant camera roll permissions inside your system's settings");
        }else{
          console.log('Media Permissions are granted')
        }
      
    }

    return (
        
        <View style={tw("relative mt-20 items-center h-5/6")}>
            <View style={imageUploaderStyles.container}>
                {
                    image  && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
                }
                    
                    <View style={imageUploaderStyles.uploadBtnContainer}>
                        <TouchableOpacity onPress={addImage} style={imageUploaderStyles.uploadBtn} >
                            <Text>{image ? 'Edit' : 'Upload'} Image</Text>
                            <AntDesign name="camera" size={20} color="black" />
                        </TouchableOpacity>
                    </View>
              

            </View>

            
            <Image 
                style={tw("h-32 w-32 mt-10 rounded-full")}
                source={{uri: user.photoURL}}
            />
            <Text style={tw("text-xl font-bold p-4")}>{user.displayName}</Text>
            
            <TextInput 
                style={[tw("text-center py-2 px-8 "),{backgroundColor:"#E2E8F0", color:"#BDBDBD"}]}
                placeholder="Update Username"
            
            />
            <TouchableOpacity 
            onPress={this.handlePickImage}
            style={[tw("w-44 py-3 px-6 mt-5"),
            {backgroundColor:"#E2E8F0"}]}>
                <Text style={[tw("text-center text-md "),{color:"#BDBDBD"}]}>Update Profile Picture</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
            style={[tw("w-64 p-3 rounded-xl absolute bottom-10"),
            {backgroundColor:"#FD7656"}]}
            >
                <Text style={tw("text-center text-white text-md")}>Update Profile</Text>
            </TouchableOpacity>
        </View>
    );
}

const imageUploaderStyles=StyleSheet.create({
    container:{
        elevation:2,
        height:200,
        width:200, 
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
