import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { StyleSheet, StatusBar, Image, Text, Alert } from 'react-native';
import MyTextInput from '../components/MyTextInput';
import MyButton from '../components/MyButton';
import { primaryColor } from '../data/consts';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  addVehiculo,
  removeVehiculo,
  updateVehiculo,
  setVehiculoAsCurrent,
} from '../data/app/appSlice';
import MyItemList from '../components/MyItemList';
import firebase from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';
import { useTranslation } from 'react-multi-lang';
import ProcessModal from '../components/ProcessModal';

/**
 * @brief Pagina para agregar/editar información de un vehiculo
 */
export default function EditScreen(props) {
  const { initialState } = props.route.params;
  const { user, vehiculos } = useSelector(state => state.app);
  const dispatch = useDispatch();
  const t = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const [vehiculo, setVehiculo] = useState({
    matricula: initialState ? initialState.matricula : '',
    fabricante: initialState ? initialState.fabricante : '',
    modelo: initialState ? initialState.modelo : '',
    status: initialState ? initialState.status : 0,
    owner: user.uid,
    current: initialState ? initialState.current : !vehiculos.length,
  });

  /**
   * @brief Agrega un nuevo vehiculo
   */
  const add = async () => {
    try {
      setShowModal(true);
      await functions().httpsCallable('createVehiculo')(vehiculo);
      props.navigation.pop();
    } catch (e) {
      Alert.alert(t('error_creating_entry', { error: e }), t(e.code));
      //Alert.alert("Error", "llegue al error");
    } finally {
      setShowModal(false);
    }
  };

  /**
   * Actualiza información de un vehiculo
   */
  const update = async () => {
    try {
      setShowModal(true);
      await firebase().doc(`vehiculos/${initialState.id}`).update({
        fabricante: vehiculo.fabricante,
        modelo: vehiculo.modelo,
      });
      dispatch(
        updateVehiculo({
          id: initialState.id,
          fabricante: vehiculo.fabricante,
          modelo: vehiculo.modelo,
        }),
      );
      props.navigation.pop();
    } catch (e) {
      Alert.alert(t('error'), t('error_updating_entry', { error: e }));
    } finally {
      setShowModal(false);
    }
  };

  /**
   * Responde al botón de Guardar/Actualizar
   */
  const handleSave = () => {
    !initialState ? add() : update();
  };

  /**
   * Actualiza el valor value en el campo field
   * @param {string} field campo
   * @param {any} value valor
   */
  const onChange = (field, value) => {
    setVehiculo({
      ...vehiculo,
      [field]: value,
    });
  };

  /**
   * Selecciona el vehiculo actual como "Actual"
   */
  const handleUseAsCurrent = async () => {
    try {
      setShowModal(true);
      await functions().httpsCallable('setVehiculoAsCurrent')({
        vehiculo: initialState.id,
      });
      dispatch(setVehiculoAsCurrent(initialState));
      props.navigation.pop();
      Alert.alert('', t('success_change_as_current'));
    } catch (e) {
      Alert.alert(
        t('error'),
        t('error_setting_vehiculo_as_default', { error: e }),
      );
    } finally {
      setShowModal(false);
    }
  };

  /**
   * Muestra modal para eliminar un vehiculo
   */
  const handleDelete = () => {
    Alert.alert(
      t('delete_vehiculo'),
      t('are_you_sure_of_delete_this_vehiculo'),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: 'OK', onPress: performDelete },
      ],
      { cancelable: true },
    );
  };

  /**
   * Elimina un vehiculo luego de ser confirmado por el usuario
   */
  const performDelete = async () => {
    try {
      setShowModal(true);
      await firebase().doc(`vehiculos/${initialState.id}`).update({
        status: -1,
      });
      dispatch(removeVehiculo(initialState));
      props.navigation.pop();
    } catch (e) {
      Alert.alert(t('error'), t('error_deleting_entry', { error: e }));
    } finally {
      setShowModal(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.scroll}
      contentContainerStyle={styles.root}>
      <StatusBar barStyle="dark-content" translucent={false} />
      <Image
        style={styles.img}
        source={require('../assests/images/logo_car.png')}
      />
      <MyTextInput
        style={styles.input}
        placeholder={t('matricula')}
        autoCapitalize="characters"
        value={vehiculo.matricula}
        onChangeText={text => onChange('matricula', text)}
        editable={!initialState}
      />
      <MyTextInput
        style={styles.input}
        placeholder={t('fabricante')}
        autoCapitalize="characters"
        value={vehiculo.fabricante}
        onChangeText={text => onChange('fabricante', text)}
      />
      <MyTextInput
        style={styles.input}
        placeholder={t('modelo')}
        autoCapitalize="characters"
        value={vehiculo.modelo}
        onChangeText={text => onChange('modelo', text)}
      />

      <Text>{'\n'}</Text>



      {!vehiculo.current && !!initialState && (
        <MyButton
          type="secondary"
          text={t('use_as_current')}
          style={styles.btn}
          onPress={handleUseAsCurrent}
        />
      )}

      {!!initialState && !vehiculo.status && (
        <MyButton
          type="secondary"
          text={t('delete_vehiculo')}
          style={styles.btn}
          onPress={handleDelete}
        />
      )}

      <MyButton
        text={t('save')}
        style={styles.btn}
        onPress={handleSave}
        disabled={!vehiculo.matricula || !vehiculo.fabricante || !vehiculo.modelo}
      />

      {showModal && <ProcessModal visible={showModal} />}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    backgroundColor: 'white',
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    padding: 20,
  },
  img: {
    height: 150,
    width: 200,
    resizeMode: 'stretch',
  },

  input: {
    marginTop: 10,
  },

  btn: {
    marginTop: 20,
    height: 35,
  },

  title: {
    fontSize: 24,
    color: primaryColor,
  },
});
