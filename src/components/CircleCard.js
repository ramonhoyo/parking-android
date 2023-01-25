import React from 'react'
import {
  View,
  StyleSheet
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { beginColor, endColor } from '../data/consts'

export default function CircleCard(props) {
  return (
    <LinearGradient
      colors={[beginColor, endColor]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ ...styles.root, ...props.style }}
    >
      {props.children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    borderRadius: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    marginHorizontal: 20,
    padding: 20,
    width: 200,
    height: 200,
    marginBottom: 10,
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
})