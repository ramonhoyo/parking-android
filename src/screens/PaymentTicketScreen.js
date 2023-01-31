import React, {useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {View, Text, StyleSheet, StatusBar, ScrollView} from 'react-native';
import {useStripe} from '@stripe/stripe-react-native';
import MyCardView from '../components/CardView';
import CircleCard from '../components/CircleCard';
import MyItemList from '../components/MyItemList';
import {useTranslation} from 'react-multi-lang';
import MyButton from '../components/MyButton';
import {RECORDS_STATUS, SLOT_STATUS, VEHICULE_STATUS} from '../data/consts';
import {differenceInHours, format} from 'date-fns';
import {Alert} from 'react-native';
import functions from '@react-native-firebase/functions';
import {updateVehicule} from '../data/app/appSlice';

/**
 * @brief Página para realizar el pago de la deuda total
 * @param {Object} props properties
 * @returns retorna un ReactNode
 */
export default function PaymentTicketScreen(props) {
  const t = useTranslation();
  const dispatch = useDispatch();
  const {initPaymentSheet, presentPaymentSheet} = useStripe();
  const {user} = useSelector(state => state.app);
  const {car_status, records, vehicule} = useSelector(state => state.app);

  const [loading, setLoading] = useState(false);
  const [rasberryEmulation, setRasberryEmulation] = useState(false);

  const record = records.length ? records[0] : null;
  const amount = !record
    ? 0
    : (differenceInHours(Date.now(), Date.parse(record.startDate)) + 1) *
      record.rate;

  /**
   * emula el rasberry para cambiar nuevamente el estado del slot al completar el pago y colocarlo en "IDLE"
   */
  const emulateRasberryCall = async () => {
    try {
      setRasberryEmulation(true);
      await functions().httpsCallable('emulateRasberryCall')({
        slot: record.slot,
        status: SLOT_STATUS.IDLE,
      });
    } catch (error) {
      Alert.alert(t('error_emulating_rasberry_call'), `${error.message}`);
    } finally {
      setRasberryEmulation(false);
    }
  };

  /**
   * Muestra un modal para que el usuario introduzca los datos de su tarjeta para realizar el pago
   */
  const handleCardPayPress = async () => {
    const {error} = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
      return;
    }
    emulateRasberryCall();
    dispatch(
      updateVehicule({
        ...vehicule,
        status: VEHICULE_STATUS.IDLE,
        entryDate: Date.now(),
      }),
    );
    props.navigation.replace('PaymentResult');
  };

  const fetchPaymentSheetParams = async () => {
    const {data} = await functions().httpsCallable('createPaymentSheet')({
      record: record ? record.id : null,
    });
    return data;
  };

  const initializePaymentSheet = async () => {
    const {paymentIntent, ephemeralKey, customer, publishableKey} =
      await fetchPaymentSheetParams();

    const {error} = await initPaymentSheet({
      merchantDisplayName: 'Upiita Parking',
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      defaultBillingDetails: {
        name: user.displayName,
        email: user.email,
        address: {
          country: 'MX',
        },
      },
    });
    if (error) {
      Alert.alert(t('error_initializing_stripe'));
      props.navigation.pop();
    }
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    initializePaymentSheet();
  }, []);

  if (!record) {
    return null;
  }

  return (
    <ScrollView style={styles.root}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" translucent={false} />
        <MyCardView style={styles.card}>
          <CircleCard>
            <Text style={styles.ammount}>{`${Intl.NumberFormat('es-MX', {
              maximumFractionDigits: 2,
              style: 'currency',
              currency: 'MXN',
            }).format(amount)}`}</Text>
          </CircleCard>
          <MyItemList itemName={t('currency')} value="MXN" />
          <MyItemList itemName={t('matricule')} value={vehicule.matricule} />
          <MyItemList itemName={t('owner')} value={user.displayName} />
          <MyItemList itemName={t('fabricant')} value={vehicule.fabricant} />
          <MyItemList itemName={t('model')} value={vehicule.model} />
          <MyItemList
            itemName={t('start_time')}
            value={
              record
                ? format(Date.parse(record.startDate), 'dd/MM/yy HH:mm')
                : '--/--/-- --:--'
            }
          />
          <MyItemList itemName={t('end_time')} value={car_status.end_date} />
        </MyCardView>

        <MyButton
          loading={loading || rasberryEmulation}
          disabled={!!record && record.status === RECORDS_STATUS.PAID}
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
