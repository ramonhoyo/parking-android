import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MyCardView from '../components/CardView';
import CircleCard from '../components/CircleCard';
import MyButton from '../components/MyButton';
import { white } from '../data/consts';

/**
 * @brief Pagina para verificar si existen puestos disponibles en el estacionamiento
 * @returns retorna un ReactNode
 */
export default function QueryScreen() {
  return (
    <ScrollView style={styles.root}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent={false} />

        <MyCardView style={styles.card}>
          <CircleCard>
            <Icon name="check" size={36} color={white} />
          </CircleCard>
          <Text style={styles.text}>Actualmente tenemos 10 puestos disponibles</Text>
        </MyCardView>

        <MyButton
          style={styles.payButton}
          text="Solicitar puesto"
          onPress={() => {  }}
        />
      </View>
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
  },

  container: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
  },

  card: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  text: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },

  payButton: {
    height: 35,
    marginTop: 20,
    width: '90%',
  },
});
