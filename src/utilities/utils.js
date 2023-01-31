import {t} from 'react-multi-lang';
import {ERRORS, RECORDS_STATUS, VEHICULE_STATUS} from '../data/consts';

/**
 * @brief formatea el estatus de un vehiculo a un texto legible
 * @param {VEHICULE_STATUS} status estatus del vehiculo
 * @returns estatus como texto
 */
export const getVehiculeStateText = status => {
  switch (status) {
    case VEHICULE_STATUS.IDLE:
      return t('idle');
    case VEHICULE_STATUS.DELETED:
      return t('deleted');
    case VEHICULE_STATUS.IN_RECORD:
      return t('in_record');
    default:
      return t('unhandled_status');
  }
};

/**
 * @brief formatea el estatus de un registro a un texto legible
 * @param {RECORDS_STATUS} status estatus de un registro
 * @returns estatus como texto
 */
export const getRecordStatus = status => {
  switch (status) {
    case RECORDS_STATUS.CANCELLED:
      return t('cancelled');
    case RECORDS_STATUS.CLOSED:
      return t('closed');
    case RECORDS_STATUS.CONFIRMED:
      return t('confirmed');
    case RECORDS_STATUS.PAID:
      return t('paid');
    case RECORDS_STATUS.RESERVED:
      return t('reserved');
    default:
      return t('unhandled_status');
  }
};
