import React from 'react'
import PropTypes from 'prop-types'
import {
  TextInput,
  StyleSheet,
  View,
} from 'react-native'
import { beginColor, endColor, textColor, white, primaryColorDark, disabledColor } from '../data/consts'
import LinearGradient from 'react-native-linear-gradient'

export default function MyTextInput(props) {
  let isPrimary = !(props.type === 'secondary');
  const { editable } = props;
  return (
    <LinearGradient
      colors={editable ? [beginColor, endColor] : [disabledColor, disabledColor]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ ...styles.container, ...props.style }}
    >
      <View style={{ ...styles.wrapper, backgroundColor: isPrimary ? white : primaryColorDark }}>
        <TextInput
          {...props}
          style={{ ...styles.text, color: isPrimary ? primaryColorDark : white, flex: 1 }}
          placeholderTextColor={textColor}
        />
      </View>
    </LinearGradient>

  );
}


const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    display: 'flex',
    minHeight: 40,
    width: '100%',
  },

  wrapper: {
    margin: 2,
    borderRadius: 5,
    display: "flex",
    flex: 1,
  },

  text: {
    fontSize: 16,
    padding: 0,
    paddingLeft: 4
  },
})

MyTextInput.defaultProps = {
  editable: true,
}

MyTextInput.propTypes = {
  value: PropTypes.string.isRequired,
  onChangeText: PropTypes.func.isRequired,
  style: PropTypes.object,
  type: PropTypes.string,
  placeholder: PropTypes.string
}
