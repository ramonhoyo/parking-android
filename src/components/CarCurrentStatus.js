import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {useSelector, useDispatch} from 'react-redux';
import {
  Text,
  StyleSheet,
  Alert,
  Modal,
  View,
  ActivityIndicator,
} from 'react-native';
import CardView from './CardView';
import MyButton from './MyButton';
import MyItemList from './MyItemList';
import {useTranslation} from 'react-multi-lang';
import {getErrorTitle, getRecordStatus} from '../utilities/utils';
import {differenceInHours, format} from 'date-fns';
import {
  primaryColor,
  RECORDS_STATUS,
  SLOT_STATUS,
  VEHICULE_STATUS,
} from '../data/consts';
import functions from '@react-native-firebase/functions';
import {setVehicules, updateRecord, updateVehicule} from '../data/app/appSlice';
import ProcessModal from './ProcessModal';

export default function CarCurrentStatus(props) {
  const dispatch = useDispatch();
  const {records, vehicules, slots, vehicule} = useSelector(state => state.app);
  const t = useTranslation();
  const activeRecord = records.length ? records[0] : null;
  const [showModal, setShowModal] = useState(false);
  const [showConfirmRecord, setShowConfirmRecord] = useState(false);
  const [networkRequest, setNetworkRequest] = useState(false);

  let amount = 0;

  if (activeRecord && !activeRecord.endDate) {
    amount =
      (differenceInHours(Date.now(), Date.parse(activeRecord.startDate)) + 1) *
      activeRecord.rate;
  } else if (activeRecord && activeRecord.endDate) {
    amount = activeRecord.amount;
  }

  const handleAnnulReservation = async () => {
    try {
      setShowModal(true);
      const {data} = await functions().httpsCallable('annulReservation')({
        record: activeRecord.id,
      });
      if (data.error) {
        Alert.alert(getErrorTitle(data.error), t(data.errorMessage));
        return;
      }
      Alert.alert(t('record_annuled'));
      dispatch(
        setVehicules(
          vehicules.map(item => {
            if (item.id === activeRecord.vehicule) {
              return {
                ...item,
                status: VEHICULE_STATUS.IDLE,
              };
            }
            return item;
          }),
        ),
      );
    } catch (e) {
      Alert.alert(t('error_annuling_record'), t('error_annuling_record_desc'));
    } finally {
      setShowModal(false);
    }
  };

  const onAnnulReservationClick = () => {
    Alert.alert(
      t('annul_record'),
      t('are_you_sure_of_annul_record'),
      [
        {text: t('cancel'), style: 'cancel'},
        {text: 'OK', onPress: handleAnnulReservation},
      ],
      {cancelable: true},
    );
  };

  const handleCancelRecord = async () => {
    try {
      setNetworkRequest(true);
      const {data} = await functions().httpsCallable('annulReservation')({
        record: activeRecord.id,
      });
      if (data.error) {
        Alert.alert(getErrorTitle(data.error), t(data.errorMessage));
      }
      dispatch(
        updateRecord({
          ...activeRecord,
          status: RECORDS_STATUS.CANCELLED,
        }),
      );
      dispatch(
        updateVehicule({
          ...vehicule,
          status: VEHICULE_STATUS.IDLE,
        }),
      );
      Alert.alert(t('record_annuled'), t('select_another_slot'));
    } catch (e) {
      Alert.alert(t('error'), t('error_annuling_record'));
    } finally {
      setNetworkRequest(false);
    }
  };

  const handleConfirmSlot = async () => {
    try {
      setNetworkRequest(true);
      const {data} = await functions().httpsCallable('confirmSlot')({
        record: activeRecord.id,
      });
      if (data.error) {
        Alert.alert(getErrorTitle(data.error), t(data.errorMessage));
      }
      dispatch(
        updateRecord({
          ...activeRecord,
          status: RECORDS_STATUS.CONFIRMED,
        }),
      );
      Alert.alert(t(''), t('slot_confirmed'));
    } catch (e) {
      Alert.alert(t('error'), t('error_annuling_record'));
    } finally {
      setNetworkRequest(false);
    }
  };

  useEffect(() => {
    if (!records.length) {
      return;
    }
    const record = records[0];
    const slot = slots.find(it => it.id === record.slot);
    if (!slot) {
      return;
    }
    setShowConfirmRecord(
      record.status === RECORDS_STATUS.RESERVED &&
        slot.status === SLOT_STATUS.BUSSY,
    );
  }, [records, slots]);

  return (
    <CardView {...props}>
      <Text style={styles.title}>{t('last_record')}</Text>
      <MyItemList
        itemName={t('current_state')}
        value={
          activeRecord
            ? getRecordStatus(activeRecord.status)
            : t('no_available')
        }
      />
      <MyItemList
        itemName={t('reg_date')}
        value={
          activeRecord && activeRecord.regDate
            ? format(Date.parse(activeRecord.regDate), 'dd/MM/yy HH:mm')
            : '--/--/-- --:--'
        }
      />
      <MyItemList
        itemName={t('start_time')}
        value={
          activeRecord
            ? format(Date.parse(activeRecord.startDate), 'dd/MM/yy HH:mm')
            : '--/--/-- --:--'
        }
      />
      <MyItemList
        itemName={t('paid_time')}
        value={
          activeRecord && activeRecord.endDate
            ? format(Date.parse(activeRecord.endDate), 'dd/MM/yy HH:mm')
            : '--/--/-- --:--'
        }
      />
      <MyItemList
        itemName={t('total_debt')}
        value={
          amount
            ? `${Intl.NumberFormat('es-MX', {
                style: 'currency',
                currency: 'MXN',
                maximumFractionDigits: 2,
              }).format(amount)}`
            : t('no_available')
        }
      />
      {activeRecord && activeRecord.status === RECORDS_STATUS.RESERVED && (
        <MyButton
          disabled={false}
          text={t('annul')}
          style={styles.buttonStyle}
          onPress={onAnnulReservationClick}
        />
      )}

      {activeRecord && activeRecord.status === RECORDS_STATUS.CONFIRMED && (
        <MyButton
          disabled={
            !activeRecord || activeRecord.status === RECORDS_STATUS.PAID
          }
          text={t('excec_payment')}
          style={styles.buttonStyle}
          onPress={props.onPayTicketClick}
        />
      )}

      <ProcessModal visible={showModal} />

      <Modal
        style={styles.centeredView}
        animationType="slide"
        transparent={true}
        visible={showConfirmRecord}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modal_title}>{t('slot_status_is_bussy')}</Text>
            <Text style={styles.modal_description}>
              {t('slot_status_is_bussy_description')}
            </Text>

            <View style={styles.buttonsWrapper}>
              <MyButton
                disabled={networkRequest}
                text={t('it_is_no_me')}
                style={styles.buttonStyle}
                onPress={handleCancelRecord}
                type="secondary"
              />
              <MyButton
                disabled={networkRequest}
                text={t('it_is_me')}
                style={styles.buttonStyle}
                onPress={handleConfirmSlot}
              />
            </View>

            {networkRequest && <ActivityIndicator color={primaryColor} />}
          </View>
        </View>
      </Modal>
    </CardView>
  );
}

CarCurrentStatus.propTypes = {
  onPayTicketClick: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
  },
  buttonStyle: {
    marginTop: 20,
    marginLeft: 4,
    marginRight: 4,
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonsWrapper: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  modal_title: {
    fontSize: 18,
    marginBottom: 10,
  },
  modal_description: {
    fontSize: 16,
    marginBottom: 10,
  },
});
