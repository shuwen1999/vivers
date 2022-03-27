import React, {useState} from 'react';
import {View, Text, TextInput, FlatList} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import firebase from 'firebase';
require ('firebase/firestore');

export default function Search(){
    const [users, setUsers] = useState([])

    const fetchUsers = (search) => {
        firebase.firestore()
        .collection('users')
        .where('displayName', '>=', search)
        .get()
        .then((snapshot)=>{
            let users = snapshot.docs.map(doc => {
                const data= doc.data();
                const id = doc.id;
                return {id, ...data}
            });
            setUsers(users);
        })
    }
    return (
        <View>
            <TextInput onChange={(search)=> fetchUsers(search)}/>
            <FlatList
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({item})=> (
                    <Text>{item.name}</Text>
                )}
            />
        </View>
    )
}
export default Search