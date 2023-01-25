import React from 'react'
import PropTypes from 'prop-types'
import { textColor, textAccentColor } from '../data/consts'
import {
  View,
  StyleSheet,
  Text,
} from 'react-native'

export default function MyItemList({ itemName, value }){
  return (
    <View style={styles.root}>
      <Text style={styles.key}>{itemName}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    width: "100%",  
    display: "flex",
    flexDirection: "row"
  },
  key: { 
    flex: 1,
    textAlign: "left",
    color: textColor,
    fontSize: 18,
  },
  value: {
    flex: 1,
    textAlign: "right",
    color: textAccentColor,
    fontSize: 18,
  }
})

MyItemList.propTypes = {
  itemName: PropTypes.string.isRequired,
  value: PropTypes.any
}