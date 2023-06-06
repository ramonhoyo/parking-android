import React from 'react';
import { useSelector } from 'react-redux';
import {
  StyleSheet,
  StatusBar,
  Text,
  FlatList,
  KeyboardAvoidingView,
  TouchableOpacity,
} from 'react-native';
import { primaryColor } from '../data/consts';
import FAB from 'react-native-fab';
import { useTranslation } from 'react-multi-lang';
import { ListItem } from 'react-native-elements';

/**
 * @brief Pagina para listar los vehiculos del usuario
 * @param {Object} props propiedades
 * @returns retorna un ReactNode
 */
export default function ManageVehiculos(props) {
  const { app } = useSelector(state => state);
  const { vehiculos } = app;
  const t = useTranslation();

  /**
   * @brief callback para responder al "onPress" de un vehiculo
   * @param {Object} item vehiculo a ser editado
   */
  const handleOnPress = (item) => {
    props.navigation.navigate('Edit', { initialState: item });
  };

  /**
   * @brief renderiza un vehiculo
   * @param {Object} param vehiculo a renderizar
   * @returns retorna un ReactNode
   */
  const renderVehiculo = ({ item }) => {
    return (
      <ListItem
        containerStyle={styles.listItem}
        key={item.id}
        bottomDivider
        Component={TouchableOpacity}
        onPress={() => handleOnPress(item)}
      >
        <ListItem.Content>
          <ListItem.Title>{`${item.matricula} ${item.current ? t('current_vehiculo') : ''}`}</ListItem.Title>
          <ListItem.Subtitle>{`${item.fabricante} ${item.modelo}`}</ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    );
  };

  const content = !vehiculos.length ?
    <Text style={styles.no_entries}>{t('no_vehiculos')}</Text> :
    <FlatList data={vehiculos} renderItem={renderVehiculo} style={styles.list} />;

  return (
    <KeyboardAvoidingView style={styles.root}>
      <StatusBar barStyle="dark-content" translucent={false} />

      {content}

      <FAB
        style={styles.fab}
        buttonColor={primaryColor}
        iconTextColor="#FFFFFF"
        onClickAction={() => props.navigation.navigate('Edit', { initialState: null })}
        visible={true}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'white',
    padding: 20,
    flex: 1,
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

  no_entries: {
    position: 'absolute',
    top: '40%',
    fontSize: 24,
  },

  list: {
    flex: 1,
    width: '100%',
  },

  listItem: {
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
    padding: 2,
  },
});
