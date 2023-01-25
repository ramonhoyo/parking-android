import React from 'react';
import { View, StatusBar, StyleSheet, Text } from 'react-native';
import { white } from '../data/consts';
import { ScrollView } from 'react-native-gesture-handler';

/**
 * Pagina para colocar las licencias de los paquetes usados en la aplicación
 * @param {React Native Page} props proiedades
 * @returns retorna la página
 */
export default function Licences(props) {
  return (
    <ScrollView>
      <View style={styles.root}>
        <StatusBar barStyle="dark-content" />
        <Text style={styles.content}>{content}</Text>
        <Text style={styles.content}>{content}</Text>
        <Text style={styles.content}>{content}</Text>
        <Text style={styles.content}>{content}</Text>
        <Text style={styles.content}>{content}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: white,
    paddingHorizontal: 15,
  },

  content: {
    fontSize: 18,
  },
});

const content = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sed luctus odio. Vivamus a mauris metus. Ut ut condimentum orci. Praesent feugiat diam pellentesque egestas egestas. Mauris eu nunc at lacus efficitur porta eu nec purus. Duis sed volutpat quam. Aliquam erat volutpat. Curabitur suscipit faucibus augue quis bibendum. Donec venenatis sagittis velit quis tempus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Etiam viverra vehicula dui, non dictum risus lacinia mollis.';
