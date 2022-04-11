import { View, Text, TouchableOpacity, SafeAreaView, FlatList, Image, StyleSheet } from 'react-native'
import React, {useEffect, useState} from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'
import useAuth from '../hooks/useAuth';
import { getDoc, QuerySnapshot, collection, getDocs, query, where, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import {db} from "../firebase";
import { LogBox } from 'react-native';
import generateId from '../lib/generateId';
import { async } from '@firebase/util';
import tw from 'tailwind-rn';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; 
import Card from '../Components/Card';

LogBox.ignoreLogs(['Setting a timer']);

const MatchScreen = () => {
    const navigation = useNavigation();
    const {user} = useAuth();
    const {params} = useRoute();
    const {sessionDetails, creatorId, sessionId,friendDetails} = params;
    const [restaurant, setRestaurant] = useState([]);
    
    useEffect(()=> {
        let unsub;

        const fetchCards = async() =>{
           
          const combinedId= generateId(user.uid,creatorId);
          const match1 = await getDocs(collection(db, "friends", combinedId, "sessions", sessionId, "matched"));
          const passed = await getDocs(collection(db,"users", creatorId, "sessions", sessionId, "passed"));
          passed.forEach((passeddoc)=>{
              console.log(passeddoc.id);
              deleteDoc(doc(db,"friends", combinedId,"sessions",sessionId,"matched",passeddoc.id));
          });
        
            unsub = onSnapshot(collection(db, "friends", combinedId, "sessions", sessionId, "matched"), (snapshot) => {
              setRestaurant(
                    snapshot.docs.map((doc) =>({
                        // id: docid,
                        ...doc.data(),
                    }))
                );
            });
        };
        fetchCards();
        return unsub;
    },[])

    const onClickItem = async(item,index) => {
        
      const chosenRestaurant = item;
      console.log(chosenRestaurant.Name);
      navigation.navigate("Restaurant",{
          chosenRestaurant
      });
  }
    
  return (
    <SafeAreaView>
      <View style={tw('flex-row py-2 relative mt-10 items-center bg-gray-200')}>
                <TouchableOpacity style={tw("pl-6")}
                    onPress={()=> navigation.navigate("Message",{friendDetails})}
                >
                <Ionicons name="chevron-back" size={30} color="black" />
                </TouchableOpacity>
                
                <Text style={[tw("text-lg ml-24"),{fontFamily: 'OleoScript_700Bold'}]}>Matches</Text>
                <Text style={[tw("rounded-lg h-8 w-20 text-center text-lg absolute right-4"),{backgroundColor:"#FD7656", color:"white", fontFamily:"Lora_700Bold"}]}>{sessionId}</Text>
            </View>
      <FlatList
        data={restaurant}
        keyExtractor = {(item,index)=>index.toString()}
        numColumns={2}
        ListFooterComponent={<View style={{height: 100}}/>}
        renderItem={({item, index})=> item? (
        
        <TouchableOpacity  
            style={{flexDirection:'row', alignItems:'center', backgroundColor: item.selected?'orange':'white'}}
            onPress={() => onClickItem(item,index)}
            
        >

            <Card
            > 
              <Image
                  style={tw(" h-32 w-32")}
                  source={{uri:item.Image}}
                  
              />
              <Text style={styles.item}key={item.id}>{item.Name}</Text>
              
          </Card>
            
            
        </TouchableOpacity>):(
            <Text>no data</Text>
        )
    }
    />
    </SafeAreaView>
  )
}

export default MatchScreen;
const styles = StyleSheet.create({
  container: {
   flex: 1,
   paddingTop: 5
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44
  },
});