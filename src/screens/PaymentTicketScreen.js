import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
} from 'react-native';
import MyCardView from '../components/CardView';
import CircleCard from '../components/CircleCard';
import MyItemList from '../components/MyItemList';
import { useTranslation } from 'react-multi-lang';
import MyButton from '../components/MyButton';
import { RECORDS_STATUS, SLOT_STATUS, VEHICULE_STATUS } from '../data/consts';
import { differenceInHours, format } from 'date-fns';
import stripe from 'tipsi-stripe';
import { Alert } from 'react-native';
import functions from '@react-native-firebase/functions';
import { updateVehicule } from '../data/app/appSlice';

/**
 * @brief asignar la clave pública de stripe
 */
stripe.setOptions({
  publishableKey: 'pk_test_51I319RK7Vp8OVljsnrdAwRJbnaAzK2gGuKiOTZCb4FL70o8tuoTKXjqhGCVE1IdkQYMBotR0SecvPAKEjZYnOfwp00I41jSfdP',
});

/**
 * @brief Página para realizar el pago de la deuda total
 * @param {Object} props properties
 * @returns retorna un ReactNode
 */
export default function PaymentTicketScreen(props) {
  const t = useTranslation();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.app);
  const { car_status, records, vehicule } = useSelector(state => state.app);

  const [loading, setLoading] = useState(false);
  const [rasberryEmulation, setRasberryEmulation] = useState(false);

  const record = records.length ? records[0] : null;
  const amount = !record ? 0 : (differenceInHours(Date.now(), Date.parse(record.startDate)) + 1) * record.rate;

  /**
   * @brief completa el pago, se llama a una funcion de google con el token recibido de stripe para que termine de ejecutar el pago
   * @param {string} _token stripe token para completar el pago
   */
  const completePayment = async (_token) => {
    try {
      const { data } = await functions().httpsCallable('completePayment')({
        record: record.id,
        token: _token,
        aproxAmount: amount,
      });

      if (data.error) {
        Alert.alert(t('payment_error'), t(data.errorMessage));
        return;
      }
      emulateRasberryCall();
      dispatch(updateVehicule({
        ...vehicule,
        status: VEHICULE_STATUS.IDLE,
        entryDate: Date.now(),
      }));
      props.navigation.replace('PaymentResult');
    } catch (e) {
      Alert.alert(t('unknow_error'));
    } finally {
      setLoading(false);
    }
  };

  /**
   * emula el rasberry para cambiar nuevamente el estado del slot al completar el pago y colocarlo en "IDLE"
   */
  const emulateRasberryCall = async () => {
    try {
      setRasberryEmulation(true);
      const response = await functions().httpsCallable('emulateRasberryCall')({
        slot: record.slot,
        status: SLOT_STATUS.IDLE,
      });
      if (response.data.error) {
        throw new Error(response.data.errorMessage);
      }
    } catch (error) {
      Alert.alert(t('error_emulating_rasberry_call'), `${error}`);
    } finally {
      setRasberryEmulation(false);
    }
  };

  /**
   * Muestra un modal para que el usuario introduzca los datos de su tarjeta para realizar el pago
   */
  const handleCardPayPress = async () => {
    try {
      setLoading(true);
      const stripeToken = await stripe.paymentRequestWithCardForm({
        // Only iOS support this options
        smsAutofillDisabled: true,
        requiredBillingAddressFields: 'full',
        prefilledInformation: {
          billingAddress: {
            name: user.displayName,
            email: user.email,
          },
        },
      });
      completePayment(stripeToken);
    } catch (error) {
      Alert.alert('', t('payment_token_error'));
      setLoading(false);
    }
  };

  if (!record) {
    return null;
  }

  return (
    <ScrollView style={styles.root}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent={false} />
        <MyCardView style={styles.card}>
          <CircleCard>
            <Text style={styles.ammount}>{`${Intl.NumberFormat('es-MX', { maximumFractionDigits: 2, style: 'currency', currency: 'MXN' }).format(amount)}`}</Text>
          </CircleCard>
          <MyItemList itemName={t('currency')} value="MXN" />
          <MyItemList itemName={t('matricule')} value={vehicule.matricule} />
          <MyItemList itemName={t('owner')} value={user.displayName} />
          <MyItemList itemName={t('fabricant')} value={vehicule.fabricant} />
          <MyItemList itemName={t('model')} value={vehicule.model} />
          <MyItemList
            itemName={t('start_time')}
            value={record ?
              format(Date.parse(record.startDate), 'dd/MM/yy HH:mm') :
              '--/--/-- --:--'
            }
          />
          <MyItemList itemName={t('end_time')} value={car_status.end_date} />
        </MyCardView>

        <MyButton
          loading={loading || rasberryEmulation}
          disabled={(!!record && record.status === RECORDS_STATUS.PAID)}
          style={styles.payButton}
          onPress={handleCardPayPress}
          text={t('excec_payment')}
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
    display: 'flex',
    alignItems: 'center',
  },
  card: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  ammount: {
    fontSize: 32,
    color: 'white',
  },

  payButton: {
    height: 35,
    marginTop: 20,
    width: '90%',
  },
});
