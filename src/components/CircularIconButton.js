import React from 'react';
import PropTypes from 'prop-types';
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {primaryColor} from '../data/consts';

export default function MyCircularIconButton(props) {
  return (
    <TouchableOpacity
      style={{...styles.root}}
      onPress={props.onPress}
      disabled={props.disabled}>
      <View style={styles.iconWrapper}>
        <Icon name={props.icon_name} color={primaryColor} size={24} />
      </View>
      <Text style={styles.text}>{props.text}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flex: 1,
  },
  iconWrapper: {
    backgroundColor: 'white',
    borderRadius: 50,
    elevation: 6,
    padding: 20,
  },
  text: {
    fontSize: 18,
    color: primaryColor,
    textAlign: 'center',
  },
});

MyCircularIconButton.defaultProps = {
  disabled: false,
};

MyCircularIconButton.propTypes = {
  icon_name: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  style: PropTypes.object,
  disabled: PropTypes.bool,
};
