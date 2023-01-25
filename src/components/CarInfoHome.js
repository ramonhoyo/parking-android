import React from 'react';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import MyItemList from './MyItemList';
import CardView from './CardView';
import MyButton from './MyButton';
import {View, Text, StyleSheet} from 'react-native';
import {useTranslation} from 'react-multi-lang';
import {getVehiculeStateText} from '../utilities/utils';
import {format} from 'date-fns';

export default function CarInfoHome(props) {
  const {vehicule, vehicules} = useSelector(state => state.app);
  const t = useTranslation();

  return (
    <CardView style={{...styles.root, ...props.style}}>
      <View style={styles.itemsContainer}>
        <Text style={styles.title}>{t('my_vehicules')}</Text>
        <MyItemList itemName={t('vehicules_length')} value={vehicules.length} />
        <MyItemList
          itemName={t('current_vehicule')}
          value={vehicule ? vehicule.matricule : '-'}
        />
        <MyItemList
          itemName={t('start_time')}
          value={
            vehicule && vehicule.entryDate
              ? format(vehicule.entryDate, 'dd/MM/yy HH:mm')
              : '--/--/-- --:--'
          }
        />
        <MyItemList
          itemName={t('last_payment_date')}
          value={
            vehicule && vehicule.lastPaymentDate
              ? format(vehicule.lastPaymentDate, 'dd/MM/yy HH:mm')
              : '--/--/-- --:--'
          }
        />
        <MyItemList
          itemName={t('state')}
          value={vehicule ? getVehiculeStateText(vehicule.status) : '-'}
        />
        <MyButton
          text={t('manage_vehicules')}
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
    fontSize: 18,
  },
});

CarInfoHome.propTypes = {
  onEditClick: PropTypes.func.isRequired,
};
