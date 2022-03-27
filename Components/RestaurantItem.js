import { View, Text , Image, TouchableOpacity} from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import tw from "tailwind-rn";

const RestaurantItem = () => {
  return (
    <TouchableOpacity 
        style={tw("flex-row items-center py-4 px-5 bg-white mx-3 my-20 rounded-lg")}
        onPress={()=> navigation.navigate("Restaurant", {
            friendDetails,
        })}>

        {//matchedUserInfo?.Image?
        // <Image
        // style={tw("rounded-full h-16 w-16 mr-4")}
        // source={{uri:matchedUserInfo?.photoURL}}
        // />
        
        // :
        <Image
            style={tw(" h-20 w-20 mr-4")}
            // source={{uri:matchedUserInfo?.ogURL}}
            source={{uri: "https://www.capitaland.com/content/dam/capitaland-media-library/retail/Singapore/Singapore/Plaza%20Singapura/BeardPapa-Carousel982x818px.jpg.transform/cap-midres/image.jpg"}}
        />
        }
        <TouchableOpacity style={{position:"absolute"}}>
            <MaterialCommunityIcons name="bookmark-outline" size={24} color="black" />
        </TouchableOpacity>
        
        <View>
            <Text style={tw("text-lg font-semibold")}>
                
            </Text>
            <Text>{"Say Hi"}</Text>
        </View>
        
    </TouchableOpacity>
  )
}

export default RestaurantItem