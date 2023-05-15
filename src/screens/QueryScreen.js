import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useSelector } from 'react-redux';
import MyCardView from '../components/CardView';
import CircleCard from '../components/CircleCard';
import MyButton from '../components/MyButton';
import { white } from '../data/consts';
import { useTranslation } from 'react-multi-lang';

/**
 * @brief Pagina para verificar si existen puestos disponibles en el estacionamiento
 * @returns retorna un ReactNode
 */
export default function QueryScreen() {
  const t = useTranslation();
  const { slots } = useSelector(state => state.app);
  const avaivableSlots = slots.filter(it => !it.vehicule);


  return (
    <ScrollView style={styles.root}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent={false} />

        <MyCardView style={styles.card}>
          <CircleCard>
            <Icon name="check" size={36} color={white} />
          </CircleCard>
          <Text style={styles.text}>{t('available_slots_count',  {count: `${avaivableSlots.length}`})}</Text>
        </MyCardView>

        <MyButton
          style={styles.payButton}
          disabled={!Boolean(avaivableSlots.length)}
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
