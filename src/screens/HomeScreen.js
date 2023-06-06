import React from 'react';
import { useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import LinearGradient from 'react-native-linear-gradient';
import { beginColor, endColor, white } from '../data/consts';
import CarInfoHome from '../components/CarInfoHome';
import CarCurrentStatus from '../components/CarCurrentStatus';
import HomeOptionsCard from '../components/HomeOptionsCard';
import { GoogleSignin } from 'react-native-google-signin';
import { logout } from '../data/auth/authSlice';
import { useTranslation } from 'react-multi-lang';

/**
 * @brief Pantalla principal de la aplicación una vez se ha ingresado con credenciales
 * @param {React Native Page} props propiedades
 * @returns retorna la página
 */
export default function HomeScreen(props) {
  const dispatch = useDispatch();
  const t = useTranslation();

  /**
   * Maneja el log out
   */
  const handleLogout = async () => {
    Alert.alert(t('logout'), t('are_you_sure_of_logout'), [
      { text: t('no'), style: 'cancel' },
      { text: t('yes'), onPress: confirmLogout },
    ]);
  };

  const confirmLogout = async () => {
    try {
      await auth().signOut();
      if (await GoogleSignin.isSignedIn()) {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
      }
      dispatch(logout());
    } catch (e) {
      Alert.alert('', t('error_logout_fail', { error: e }));
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar
        backgroundColor="#0000"
        barStyle="light-content"
        translucent={true}
      />
      <LinearGradient
        style={styles.headerWrapper}
        colors={[beginColor, endColor]}
      />
      <Icon
        name="sign-out"
        size={30}
        color={white}
        style={styles.logout}
        onPress={handleLogout}
      />
      <Text style={styles.title}>{t('UPIITA_parking')}</Text>
      <View style={styles.wrapper}>
        <ScrollView style={styles.scroll}>
          <CarInfoHome
            onEditClick={() => props.navigation.navigate('ManageVehiculos')}
          />
          <CarCurrentStatus
            style={styles.carStatusCar}
            onPayTicketClick={() => props.navigation.navigate('Ticket')}
          />
          <HomeOptionsCard
            style={styles.options}
            onQueryClick={() => props.navigation.navigate('Query')}
            onAboutClick={() => props.navigation.navigate('About')}
            onParkingClick={() => props.navigation.navigate('Map')}
          />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginTop: 10,
  },
  root: {
    flex: 1,
    backgroundColor: white,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  headerWrapper: {
    position: 'absolute',
    height: 250,
    left: 0,
    right: 0,
    top: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  title: {
    marginTop: 80,
    fontSize: 28,
    color: white,
    zIndex: 1,
  },
  logout: {
    position: 'absolute',
    top: 30,
    right: 20,
    zIndex: 1,
  },
  carStatusCar: {
    marginTop: 20,
  },
  options: {
    marginTop: 20,
  },
});
