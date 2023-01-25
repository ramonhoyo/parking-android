import React from 'react';
import PropTypes from 'prop-types';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { beginColor, endColor, primaryColor, white } from '../data/consts';
import LinearGradient from 'react-native-linear-gradient';


export default function MyButton(props) {
  const { type, onPress, text, style, loading } = props;
  const disabled = props.disabled || loading;
  const isPrimary = type === 'primary';
  let bColor = disabled ? 'gray' : beginColor;
  let eColor = disabled ? 'gray' : endColor;

  const touchableOpacityStyle = {
    ...styles.wrapper,
    backgroundColor:
      isPrimary ? null : white,
  };

  const textStyle = {
    color: isPrimary ? white : disabled ? 'gray' : primaryColor,
    fontSize: 16,
    textAlign: 'center',
  };

  return (
    <LinearGradient
      colors={[bColor, eColor]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{ ...styles.container, ...style }}
    >
      <TouchableOpacity
        style={touchableOpacityStyle}
        onPress={onPress}
        disabled={disabled}
      >
        <Text style={textStyle}>
          {text}
        </Text>
      </TouchableOpacity>
      {loading && (
        <ActivityIndicator style={styles.activityInicator} color={primaryColor} />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    display: 'flex',
    minHeight: 30,
    position: 'relative',
  },

  wrapper: {
    margin: 2,
    padding: 2,
    borderRadius: 5,
    display: 'flex',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  activityInicator: {
    position: 'absolute',
    top: 8,
    right: 0,
    left: 0,
    zIndex: 1,
  },
});

MyButton.defaultProps = {
  disabled: false,
  type: 'primary',
  loading: false,
};

MyButton.propTypes = {
  text: PropTypes.string.isRequired,
  onPress: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['primary', 'secondary']),
  style: PropTypes.object,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
};
