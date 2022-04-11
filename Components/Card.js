import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Card = (props) => {
    
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
          {props.children}
      </View>
    </View>
  )
}

export default Card

const styles = StyleSheet.create({
    card:{
        borderRadius:6,
        elevation:3,
        backgroundColor:'#fff',
        shadowOffset:{width:1,height:1},
        shadowColor:'#333',
        shadowOpacity:0.3,
        shadowRadius:2,
        marginHorizontal:4,
        marginVertical:6,
        alignItems:'center',
        width:172,
       
        
        
    },
    cardContent:{
        marginHorizontal:10,
        marginVertical:10,
        alignItems:'center',
        
    }
})