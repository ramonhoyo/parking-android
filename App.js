/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import { ThemeProvider } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {
  setDefaultLanguage,
  setTranslations,
  useTranslation,
} from 'react-multi-lang';
import HomeScreen from './src/screens/HomeScreen';
import EditScreen from './src/screens/EditScreen';
import PaymentTicketScreen from './src/screens/PaymentTicketScreen';
import QueryScreen from './src/screens/QueryScreen';
import PaymentResultScreen from './src/screens/PaymentResultScreen';
import About from './src/screens/About';
import Licences from './src/screens/Licences';
import ParkingMap from './src/screens/ParkingMap';
import ManageVehiculos from './src/screens/ManageVehiculos';
import LoginScreen from './src/screens/LoginScreen';
import PermissionsScreen from './src/screens/PermissionsScreen';
import SplashScreen from './src/screens/SplashScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';
import {
  setPermissions,
  setRecords,
  setSlots,
  setUser,
  setVehiculos,
} from './src/data/app/appSlice';
import { Alert } from 'react-native/Libraries/Alert/Alert';
import { setAuthId, setIsLoading } from './src/data/auth/authSlice';
import es from './src/assests/langs/es.json';
import { StripeProvider } from '@stripe/stripe-react-native';

// Do this two lines only when setting up the application
setTranslations({ es });
setDefaultLanguage('es');

if (__DEV__) {
  // If you are running on a physical device, replace localhost with the local ip of your PC, e.g. 192.168.0.103
  // functions().useEmulator('192.168.0.103', 5000);
  functions().useEmulator('localhost', 5000);

}

const Stack = createNativeStackNavigator();

const App = () => {
  const state = useSelector(_state => _state);
  const { isLoading, authId } = state.auth;
  const { user, vehiculo, permissions } = state.app;
  const dispatch = useDispatch();
  const t = useTranslation();
  const MainStack = (
    <Stack.Navigator initialRouteName="Home" mode="card">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Edit"
        component={EditScreen}
        options={({ route }) => ({
          title: route.params.initialState
            ? t('edit_vehiculo')
            : t('add_vehiculo'),
        })}
      />
      <Stack.Screen
        name="Ticket"
        component={PaymentTicketScreen}
        options={{ title: t('excec_payment') }}
      />
      <Stack.Screen
        name="Query"
        component={QueryScreen}
        options={{ title: t('query') }}
      />
      <Stack.Screen
        name="PaymentResult"
        component={PaymentResultScreen}
        options={{ title: t('payment_result') }}
      />
      <Stack.Screen
        name="About"
        component={About}
        options={{ title: t('about') }}
      />
      <Stack.Screen
        name="Licences"
        component={Licences}
        options={{ title: t('licences') }}
      />
      <Stack.Screen
        name="Map"
        component={ParkingMap}
        options={{ title: t('parking') }}
      />
      <Stack.Screen
        name="ManageVehiculos"
        component={ManageVehiculos}
        options={{ title: t('manage_vehiculos') }}
      />
    </Stack.Navigator>
  );

  const LoginStack = (
    <Stack.Navigator mode="card">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerShown: false,
          animationTypeForReplace: !user ? 'pop' : 'push',
        }}
      />
    </Stack.Navigator>
  );

  const PermissionsStack = (
    <Stack.Navigator mode="card">
      <Stack.Screen
        name="Permissions"
        component={PermissionsScreen}
        options={{
          headerShown: false,
          animationTypeForReplace: !user ? 'pop' : 'push',
        }}
      />
    </Stack.Navigator>
  );

  const SplashStack = (
    <Stack.Navigator>
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );

  function onAuthStateChanged(data) {
    dispatch(setAuthId(data ? data.uid : ''));
    if (isLoading) {
      dispatch(setIsLoading(false));
    }
  }

  const handleFirebaseError = error => {
    Alert.alert(t('error_getting_slots'), `${error}`);
  };

  const handleSlotsSnapshot = snapshot => {
    const results = [];
    snapshot.forEach(docSnapshot => {
      results.push({
        ...docSnapshot.data(),
        id: docSnapshot.id,
      });
    });
    dispatch(setSlots(results));
  };

  useEffect(() => {
    const unsubscriberAuth = auth().onAuthStateChanged(onAuthStateChanged);
    const unsubscriberSlots = firestore().collection('slots').onSnapshot({
      error: handleFirebaseError,
      next: handleSlotsSnapshot,
    });
    check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      .then(result => {
        dispatch(
          setPermissions({
            location: result,
          }),
        );
      })
      .catch(error => {
        Alert.alert('', t('error_requesting_permission'));
      });
    return () => {
      unsubscriberAuth();
      unsubscriberSlots();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!authId) {
      dispatch(setUser(null));
      return;
    }
    const vehiculosUnsubscriber = firestore()
      .collection('vehiculos')
      .where('owner', '==', authId)
      .where('status', '>=', 0)
      .onSnapshot(snapshot => {
        if (!snapshot) {
          return;
        }
        dispatch(
          setVehiculos(
            snapshot.docs.map(docSnapshot => {
              const data = docSnapshot.data();
              return {
                ...data,
                entryDate: data.entryDate ? data.entryDate.toMillis() : null,
                exitDate: data.exitDate ? data.exitDate.toMillis() : null,
                lastPaymentDate: data.lastPaymentDate
                  ? data.lastPaymentDate.toMillis()
                  : null,
                id: docSnapshot.id,
              };
            }),
          ),
        );
      });

    const userUnsubscriber = firestore()
      .doc(`users/${authId}`)
      .onSnapshot(snapshot => {
        if (snapshot && snapshot.exists) {
          dispatch(setUser(snapshot.data()));
        } else {
          dispatch(setUser(null));
        }
      });

    return () => {
      userUnsubscriber();
      vehiculosUnsubscriber();
    };
  }, [authId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!vehiculo) {
      return;
    }
    (async () => {
      try {
        const { data } = await functions().httpsCallable('getRecords')({
          vehiculo: vehiculo.id,
        });
        dispatch(setRecords(data));
      } catch (e) {
        Alert.alert(t(e.code), t(e.message));
      }
    })();
  }, [vehiculo]); // eslint-disable-line react-hooks/exhaustive-deps

  let stack = null;
  if (permissions.location !== RESULTS.GRANTED) {
    stack = PermissionsStack;
  } else if (isLoading) {
    stack = SplashStack;
  } else if (!user) {
    stack = LoginStack;
  } else {
    stack = MainStack;
  }

  return (
    <ThemeProvider>
      <StripeProvider publishableKey="pk_test_51I319RK7Vp8OVljsnrdAwRJbnaAzK2gGuKiOTZCb4FL70o8tuoTKXjqhGCVE1IdkQYMBotR0SecvPAKEjZYnOfwp00I41jSfdP">
        <NavigationContainer>{stack}</NavigationContainer>
      </StripeProvider>
    </ThemeProvider>
  );
};

export default App;
