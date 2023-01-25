import React, { useEffect } from 'react';
import { white } from '../data/consts';
import {
  Alert,
  View,
  StyleSheet,
  StatusBar,
  Image,
  ImageBackground,
  Text,
  Dimensions,
} from 'react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from 'react-native-google-signin';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useTranslation } from 'react-multi-lang';

var pkg = require('../../package.json');

/**
 * @brief Pagina de login de la aplicación
 * @returns La pagina como un nodo React
 */
export default function LoginScreen() {
  const t = useTranslation();

  /**
   * @brief metodo para hacer el login contra GoogleSignin
   */
  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const data = await GoogleSignin.signIn();
      const credential = auth.GoogleAuthProvider.credential(data);
      credential.token = credential.token.idToken; //Adding this line fixed the issue
      const result = await auth().signInWithCredential(credential);
      const userDoc = await firestore().doc(`users/${result.user.uid}`).get();
      if (!userDoc.exists) {
        await firestore().doc(`users/${result.user.uid}`).set({
          displayName: result.user.displayName,
          email: result.user.email,
          uid: result.user.uid,
        });
      }
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        Alert.alert('', t('signin_cancelled'));
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert('', t('signin_in_progress'));
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('', t('error_PLAY_SERVICES_NOT_AVAILABLE'));
      } else {
        Alert.alert('', t('error_signin', { error }));
      }
    }
  };

  /**
   * Asignar el api-key de servicio de GoogleSignin
   */
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '702719306143-ltgaimrc12dk4oi2k23tclkblrk74f34.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
    });
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#0000" translucent={true} />
      <ImageBackground
        style={styles.img}
        resizeMode="cover"
        source={require('../assests/images/background.jpg')}
      />
      <Text style={styles.version}>V{pkg.version}</Text>
      <Text style={styles.ing}>{t('telematics_engineering')}</Text>
      <Image
        source={require('../assests/images/logo.png')}
        style={styles.logo}
      />

      <GoogleSigninButton
        style={styles.googleSignInButton}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signInWithGoogle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 150,
    zIndex: 2,
  },

  img: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Dimensions.get('window').height,
    resizeMode: 'stretch',
  },

  logo: {
    width: '90%',
    resizeMode: 'stretch',
  },

  version: {
    position: 'absolute',
    top: 30,
    right: 10,
    fontSize: 16,
    color: '#fff',
  },

  ing: {
    position: 'absolute',
    top: Dimensions.get('window').height - 40,
    right: 10,
    fontSize: 18,
    color: white,
  },

  googleSignInButton: {
    width: '90%',
    height: 48,
  },
});
