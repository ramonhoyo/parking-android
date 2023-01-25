import React from 'react'
import {
  View,
  StyleSheet
} from 'react-native'

export default function MyCardView(props){
  return (
    <View style={{...props.style, ...styles.root}}>
    {props.children}
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  
    elevation: 5,
    marginHorizontal:  20,
    padding: 20,
    width: '90%',
    marginBottom: 10,
    backgroundColor: "white"
  }
})