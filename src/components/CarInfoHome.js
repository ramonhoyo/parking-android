import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import MyItemList from './MyItemList';
import CardView from './CardView';
import MyButton from './MyButton';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-multi-lang';
import { getVehiculoStateText } from '../utilities/utils';
import { format } from 'date-fns';

export default function CarInfoHome(props) {
  const { vehiculo, vehiculos } = useSelector(state => state.app);
  const t = useTranslation();

  return (
    <CardView style={{ ...styles.root, ...props.style }}>
      <View style={styles.itemsContainer}>
        <Text style={styles.title}>{t('my_vehiculos')}</Text>
        <MyItemList itemName={t('vehiculos_length')} value={vehiculos.length} />
        <MyItemList
          itemName={t('current_vehiculo')}
          value={vehiculo ? vehiculo.matricula : '-'}
        />
        <MyItemList
          itemName={t('start_time')}
          value={
            vehiculo && vehiculo.entryDate
              ? format(vehiculo.entryDate, 'dd/MM/yy HH:mm')
              : '--/--/-- --:--'
          }
        />
        <MyItemList
          itemName={t('last_payment_date')}
          value={
            vehiculo && vehiculo.lastPaymentDate
              ? format(vehiculo.lastPaymentDate, 'dd/MM/yy HH:mm')
              : '--/--/-- --:--'
          }
        />
        <MyItemList
          itemName={t('state')}
          value={vehiculo ? getVehiculoStateText(vehiculo.status) : '-'}
        />
        <MyButton
          text={t('manage_vehiculos')}
          style={styles.editButton}
          onPress={props.onEditClick}
        />
      </View>
    </CardView>
  );
}

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },

  imgWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },

  itemsContainer: {
    flex: 1,
    marginLeft: 8,
  },

  editButton: {
    height: 30,
    marginTop: 20,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

CarInfoHome.propTypes = {
  onEditClick: PropTypes.func.isRequired,
};
