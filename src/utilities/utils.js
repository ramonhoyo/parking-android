import { t } from 'react-multi-lang';
import { ERRORS, RECORDS_STATUS, VEHICULO_STATUS } from '../data/consts';

/**
 * @brief formatea el estatus de un vehiculo a un texto legible
 * @param {VEHICULO_STATUS} status estatus del vehiculo
 * @returns estatus como texto
 */
export const getVehiculoStateText = status => {
  switch (status) {
    case VEHICULO_STATUS.IDLE:
      return t('idle');
    case VEHICULO_STATUS.DELETED:
      return t('deleted');
    case VEHICULO_STATUS.IN_RECORD:
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
