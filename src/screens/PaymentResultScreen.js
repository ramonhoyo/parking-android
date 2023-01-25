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
import { white } from '../data/consts';
import {useTranslation} from 'react-multi-lang';
import MyButton from '../components/MyButton';

/**
 * @brief Pagina de resultado de pago
 * @param {Object} props propiedades
 * @returns retorna un ReactNode
 */
export default function PaymentResultScreen(props) {
  const t = useTranslation();
  return (
    <ScrollView style={styles.root}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent={false} />
        <MyCardView style={styles.card}>
          <CircleCard>
            <Icon name="check" size={36} color={white} />
          </CircleCard>
          <Text style={styles.text}>{t('succesfully_payment_excec')}</Text>
        </MyCardView>
        <MyButton style={styles.payButton} onPress={() => props.navigation.popToTop()} text={t('go_home')} />
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
