import React from 'react';
import { View, StatusBar, StyleSheet, Text } from 'react-native';
import { primaryColor, white } from '../data/consts';
import MyButton from '../components/MyButton';
import MyItemList from '../components/MyItemList';
import { useTranslation } from 'react-multi-lang';
var pkg = require('../../package.json');

/**
 * Pagina de información con detalles de la aplicación, versión, autores
 * @param {PageProps} props
 * @returns Página "Acerca de"
 */
export default function About(props) {
  const t = useTranslation();
  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <MyItemList itemName={t('version')} value={'V'.concat(pkg.version)} />
      <Text style={styles.version} />
      <Text style={styles.title}>{t('description')}</Text>
      <Text style={styles.content}>{content}</Text>
      <Text style={styles.title}>{t('authors')}</Text>

      <Text style={styles.name}>{t('author1', { author: 1 })}</Text>
      <Text style={styles.email}>{t('author_email1', { author: 1 })}</Text>
      <Text style={styles.name}>{t('author2', { author: 2 })}</Text>
      <Text style={styles.email}>{t('author_email2', { author: 2 })}</Text>
      {/**<MyButton style={styles.button} text={t('see_credit')}
        onPress={() => { props.navigation.navigate('Licences'); }}
  />*/}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: white,
    paddingHorizontal: 15,
  },

  title: {
    fontSize: 24,
    color: primaryColor,
  },

  version: {
    position: 'absolute',
    top: 30,
    right: 10,
    fontSize: 16,
    color: '#fff',
  },

  content: {
    fontSize: 18,
  },

  name: {
    fontSize: 18,
  },

  email: {
    marginLeft: 20,
    fontSize: 18,
  },

  button: {
    marginTop: 10,
    height: 35,
  },
});

const content = 'Aplicación para buscar un cajón en un estacionamiento, como parte del Proyecto Terminal II.';
