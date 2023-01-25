import React from 'react';
import { Image, View, StyleSheet, StatusBar } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';

/**
 * @brief Página de carga de la aplicación
 * @returns retorna un ReactNode
 */
export default function SplashScreen() {
  return (
    <View style={styles.body}>
      <StatusBar backgroundColor="#fff"/>
      <Image
        source={require('../assests/images/logo.png')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
    flex: 1,
  },
});
