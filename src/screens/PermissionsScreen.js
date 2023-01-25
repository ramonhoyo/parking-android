import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Image, View, StyleSheet, StatusBar, Text, Alert } from 'react-native';
import { request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useTranslation } from 'react-multi-lang';
import MyButton from '../components/MyButton';
import { setPermissions } from '../data/app/appSlice';

/**
 * @brief Pagina para solicitar los permisos necesarios para correr la aplicación
 * @returns retorna un ReactNode
 */
export default function PermissionsScreen() {
  const dispatch = useDispatch();
  const t = useTranslation();
  const { permissions } = useSelector(state => state.app);

  /**
   * @brief solicita al usuario los permisos necesarios
   */
  const handleRequestPermissions = async () => {
    try {
      const result = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION, {
        title: t('location_permission'),
        message: t('we_need_localization_permission'),
        buttonPositive: t('grant'),
        buttonNegative: t('deny'),
      });
      dispatch(setPermissions({
        location: result,
      }));
    } catch (e) {
      Alert.alert('', t('error_requesting_permission'));
    }
  };

  /**
   * Abre el menú de configuración del SO
   */
  const handleOpenSettings = async () => {
    openSettings()
    .catch(() => {
      Alert.alert('', t('unable_to_open_settings'));
    });
  };

  return (
    <View style={styles.body}>
      <StatusBar backgroundColor="#fff" />
      <Image
        style={styles.img}
        source={require('../assests/images/logo.png')}
      />
      <Text style={styles.title}>
        {t('we_need_your_permissions')}
      </Text>

      {permissions.location === RESULTS.BLOCKED && (
        <Text style={styles.subtitle}>
          {t('permission_bloked')}
        </Text>
      )}

      {permissions.location === RESULTS.BLOCKED && (
        <MyButton
          style={styles.button}
          onPress={handleOpenSettings}
          text={t('open_app_settings')}
        />
      )}

      {permissions.location !== RESULTS.BLOCKED && (
        <MyButton
          disabled={permissions.location === RESULTS.BLOCKED}
          style={styles.button}
          onPress={handleRequestPermissions}
          text={t('request_permissions')}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    display: 'flex',
    flex: 1,
  },
  img: {
    marginTop: 100,
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    margin: 16,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    margin: 16,
  },
  button: {
    padding: 8,
  },
});
