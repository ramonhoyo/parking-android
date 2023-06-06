import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  View,
  StyleSheet,
  Alert,
  Platform,
  Linking,
  Button,
  Image,
} from 'react-native';
import MapView, {
  Polygon,
  Marker,
  Polyline,
  enableLatestRenderer,
} from 'react-native-maps';
import {
  primaryColor,
  parkingArea,
  RECORDS_STATUS,
  SLOT_STATUS,
  VEHICULO_STATUS,
} from '../data/consts';
import {
  setCarLocation,
  setVehiculos,
  updateVehiculo,
} from '../data/app/appSlice';
import functions from '@react-native-firebase/functions';
import { useTranslation } from 'react-multi-lang';
import MyButton from '../components/MyButton';
import ProcessModal from '../components/ProcessModal';
import Geolocation from 'react-native-geolocation-service';
import Icon from 'react-native-vector-icons/FontAwesome';
import OptionsMenu from 'react-native-option-menu';
import Config from "react-native-config";

enableLatestRenderer();

var polyline = require('@mapbox/polyline');
const geolib = require('geolib');

const formatPoint = point => `${point.latitude},${point.longitude}`;
const comparePositions = (f, s) =>
  f.latitude === s.latitude && f.longitude === s.longitude;

/**
 * @brief Pagina del Mapa
 * @param {Object} props propiedades
 * @returns retorna un ReactNode
 */
export default function ParkingMap(props) {
  const { navigation } = props;
  const t = useTranslation();
  const { car_status, slots, records, vehiculo, vehiculos } = useSelector(
    state => state.app,
  );
  const dispatch = useDispatch();
  const [route, setRoute] = useState([]);
  const [destination, setDestination] = useState(null);
  const [emulation, setEmulation] = useState(false);
  const [emulable, setEmulable] = useState(false);
  const [askedForEmulation, setAskedForEmulation] = useState(false);
  const [map_ref, setMapRef] = useState(null);
  const [rasberryEmulation, setRasberryEmulation] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const selectedSlot = destination
    ? slots.find(it => it.id === destination.slot)
    : null;

  /**
   * @brief Función que responde al evento de "Reservar Puesto"
   * - Se hace la reserva del puesto en base de datos
   * - Se cambia el status del vehiculo a IN_RECORD
   * - Si ocurre un error se muestra una alerta indicando que ocurrió un error
   * @param {Point} slot puesto seleccionado
   */
  const handleReserveSlot = async slot => {
    try {
      setShowModal(true);
      await functions().httpsCallable('reserveSlot')({
        vehiculo: vehiculo.id,
        slot: slot.id,
      });
      dispatch(
        setVehiculos(
          vehiculos.map(item => {
            if (item.id === vehiculo.id) {
              return {
                ...item,
                status: VEHICULO_STATUS.IN_RECORD,
              };
            }
            return item;
          }),
        ),
      );
    } catch (e) {
      Alert.alert(t('unable_to_create_record'), t(e.message));
    } finally {
      setShowModal(false);
    }
  };

  /**
   * Función que responde cuando un usuario presiona sobre un puesto
   * - Se muestra un modal de confirmación para validar que desea usar ese puesto
   * @param {MarkerClickEvet} param
   */
  const handleMarkerClick = ({ nativeEvent }) => {
    let idx = slots.findIndex(item => {
      return (
        item.latitude === nativeEvent.coordinate.latitude &&
        item.longitude === nativeEvent.coordinate.longitude
      );
    });
    Alert.alert(t('slot', { slot: idx + 1 }), t('do_you_want_reserve_slot'), [
      { text: t('no'), style: 'cancel' },
      { text: t('yes'), onPress: () => handleReserveSlot(slots[idx]) },
    ]);
  };

  /**
   * @brief función que solicita la ruta desde la posición del usuario hasta el puesto elegido usando los servicios de Google Maps
   * @param {Coordenada} begin coordenada de inicio (Posición del vehiculo)
   * @param {Coordenada} end  coordenada destino (Posición del puesto)
   */
  const getDirections = async (begin, end) => {
    try {
      const ulr = `https://maps.googleapis.com/maps/api/directions/json?origin=${formatPoint(begin)}&destination=${formatPoint(end)}&key=${Config.GOOGLE_MAPS_API_KEY}`;
      const resp = await fetch(ulr);
      const respJson = await resp.json();
      if (respJson.status === 'REQUEST_DENIED') {
        Alert.alert(t('api_request_denied'), t('api_request_denied_details'));
        return;
      }
      const points = polyline.decode(
        respJson.routes[0].overview_polyline.points,
      );
      const _route = points.map(point => ({
        latitude: point[0],
        longitude: point[1],
      }));
      setRoute(_route);
    } catch (error) {
      Alert.alert(t('error'), t(error.message));
      return error;
    }
  };

  /**
   * @brief crea una url que se envia al SO quién a su vez redirige a la aplicación de Google Maps en caso
   * de que el usuario desee usar google maps
   */
  const openExternalMaps = () => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${selectedSlot.latitude},${selectedSlot.longitude}`;
    const label = t('park_slot');
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`,
    });
    Linking.openURL(url);
  };

  /**
   * @brief Emula el llamado del Rasberry para el puesto elegido por el usuario, y cambia su estatus a "BUSSY"
   */
  const handleRasberryClick = async () => {
    try {
      setRasberryEmulation(true);
      await functions().httpsCallable('emulateRasberryCall')({
        slot: destination.slot,
        status: SLOT_STATUS.BUSSY,
      });
    } catch (error) {
      Alert.alert(t('error_emulating_rasberry_call'), `${error.message}`);
    } finally {
      setRasberryEmulation(false);
    }
  };

  /**
   * @brief Hook de efectos que responde a los cambios en la variable de estaudo "destination",
   * de esta manera cuando existe un "destination" se llama al metodo getDirections para obtener la ruta entre
   * la posicion del usuario y el destino elegido
   */
  useEffect(() => {
    if (destination) {
      const slot = slots.find(it => it.id === destination.slot);
      if (slot) {
        getDirections(car_status.location, slot);
      }
    }
  }, [destination]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (askedForEmulation) {
      return;
    }
    const startPoint = { latitude: 19.51082, longitude: -99.12669 };
    // Si la distancia entre el vehiculo y el destino es menor que 2 metros, detine la emulación y retorna
    const diff = geolib.getDistance(car_status.location, startPoint);
    if (!emulable && diff > 1000) {
      setAskedForEmulation(true);
      Alert.alert(t('far_away'), t('far_away_details'), [
        {
          text: t('back'),
          onPress: () => props.navigation.pop(), // retorna a la pantalla anterior
        },
        {
          text: t('emulate'),
          onPress: () => {
            setEmulable(true);
            dispatch(setCarLocation(startPoint));
          },
        },
      ]);
    }
  }, [car_status.location, emulable]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * @brief hook de efecto para emular el vehiculo, aqui se controla toda el proceso de emulación
   */
  useEffect(() => {
    // si no se está emulando, retorna
    if (!emulation || !route.length) {
      return;
    }

    // Si la distancia entre el vehiculo y el destino es menor que 2 metros, detine la emulación y retorna
    if (geolib.getDistance(car_status.location, route[route.length - 1]) < 2) {
      setEmulation(false);
      return;
    }

    // route es un arreglo donde cada elemento es un nodo de la ruta entre la posición del vehiculo original y el destino del puesto seleccionado
    // calculado por getDirections, ahora será necesario encontrar la línea AB del poligono de rutas en route, donde se encuentra el vehiculo actualmente
    let start = null,
      end = null;
    for (let i = 0; i < route.length - 1; ++i) {
      // si la posición del vehiculo no la misma que la del nodo en la posición i+1 y la posición del vehiculo está en la linea definida por los puntos
      // route[i] y route[i+1], entonces asignar start = route[i] y end[route+1]
      if (
        !comparePositions(car_status.location, route[i + 1]) &&
        geolib.isPointInLine(car_status.location, route[i], route[i + 1])
      ) {
        start = route[i];
        end = route[i + 1];
        break;
      }
    }

    // si no se encontró la línea en la cual está el vehiculo, retorna
    if (!start) {
      setEmulation(false);
      Alert(t('error'), t('out_of_bounds'));
      return;
    }

    // obetener la dirección entre la posición del vehiculo y el final de linea encontrada
    const bearing = geolib.getRhumbLineBearing(car_status.location, end);
    // calcular el siguiente punto, 2 metros adelante en la dirección calculada y almacenada en bearing
    let next_point = geolib.computeDestinationPoint(
      car_status.location,
      2,
      bearing,
    );
    // calcular distancia entre el final de la línea encontrada y el vehiculo
    const d1 = geolib.getDistance(car_status.location, end);
    // calcular distancia entre el siguiente punto y el vehiculo
    const d2 = geolib.getDistance(car_status.location, next_point);
    // si la distancia del siguiente punto calculado y el vehiculo es mayor que la del vehiculo y el punto final de la linea
    // entonces asignar el final de línea al siguiente punto, para evitar que llegue más lejos que el segmento start-end
    if (d2 > d1) {
      next_point = end;
    }
    // luego de 200ms asignar la nueva posición al vehiculo
    setTimeout(() => {
      dispatch(setCarLocation(next_point));
    }, 200);
  }, [car_status.location, emulation, route]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!map_ref) {
      return;
    }
    map_ref.animateToRegion({
      latitude: car_status.location.latitude,
      longitude: car_status.location.longitude,
      latitudeDelta: 0.0003,
      longitudeDelta: 0.0003,
    });
  }, [car_status.location]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * @brief Cuando ocurre un cambio en los "records", verifica que el último registro (posición 0) esté reservado o confirmado,
   * de ser el caso asigna el destino a "la posición inidcada en records[0]"
   */
  useEffect(() => {
    if (
      !records.length ||
      (records[0].status !== RECORDS_STATUS.RESERVED &&
        records[0].status !== RECORDS_STATUS.CONFIRMED)
    ) {
      setDestination(null);
    } else {
      setDestination(records[0]);
      if (emulable) {
        setEmulation(true);
      }
    }
  }, [records]); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * Hook de efectos para hacer tracking al usuario
   */
  useEffect(() => {
    const watcherId = Geolocation.watchPosition(
      position => {
        // nueva posición
        if (!emulable) {
          dispatch(setCarLocation(position.coords));
        }
      },
      () => {
        // ocurrió un error obteniendo la posición del usuario
        Alert.alert(t('geo_error'), t('geo_error_details'), [
          {
            text: t('understand'),
            onPress: () => props.navigation.pop(), // retorna a la pantalla anterior
          },
        ]);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 1,
        fastestInterval: 1000,
      },
    );
    return () => Geolocation.clearWatch(watcherId); // limpia el vigilante de posición
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emulable, dispatch]);

  const clearSlotData = async () => {
    try {
      setShowModal(true);
      await functions().httpsCallable('clearAllSlots')();
      Alert.alert('', t('all_data_cleared'));
    } catch (e) {
      Alert.alert(t('all_data_cleared_error'), t(e.message));
    } finally {
      setShowModal(false);
    }
  };

  const emulateCarEntry = async () => {
    try {
      setShowModal(true);
      await functions().httpsCallable('changeVehiculoStatus')({
        matricula: vehiculo.matricula,
        status: 'entry',
      });
      dispatch(
        updateVehiculo({
          ...vehiculo,
          entryDate: Date.now(),
        }),
      );
      Alert.alert('', t('entry_date_registered'));
    } catch (e) {
      Alert.alert(t('entry_date_registered_error'), t(e.message));
    } finally {
      setShowModal(false);
    }
  };

  const emulateCarExit = async () => {
    try {
      setShowModal(true);
      await functions().httpsCallable('changeVehiculoStatus')({
        matricula: vehiculo.matricula,
        status: 'exit',
      });
      dispatch(
        updateVehiculo({
          ...vehiculo,
          exitDate: Date.now(),
        }),
      );
      Alert.alert('', t('exit_date_registered'));
    } catch (e) {
      Alert.alert(t('exit_date_registered_error'), t(e.message));
    } finally {
      setShowModal(false);
    }
  };

  const myIcon = <Icon name="ellipsis-v" size={24} style={styles.moreButton} />;

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <OptionsMenu
          customButton={myIcon}
          destructiveIndex={1}
          options={[
            t('emulate_car_entry'),
            t('emulate_car_exit'),
            t('clear_slot_data'),
            t(''),
          ]}
          actions={[emulateCarEntry, emulateCarExit, clearSlotData]}
        />
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  return (
    <View style={styles.root}>
      <MapView
        ref={map => setMapRef(map)}
        style={styles.map}
        initialRegion={{
          latitude: 19.51082,
          longitude: -99.12669,
          latitudeDelta: 0.0003,
          longitudeDelta: 0.0003,
        }}>
        <Polygon
          coordinates={parkingArea}
          strokeColor={primaryColor}
          strokeWidth={2}
        />

        {slots.map((item, i) => {
          let disabled =
            !!destination ||
            item.status !== SLOT_STATUS.IDLE ||
            vehiculo.status !== VEHICULO_STATUS.IDLE;
          if (
            destination &&
            (destination.slot === item.id ||
              destination.status === RECORDS_STATUS.CANCELLED)
          ) {
            disabled = false;
          }
          return (
            <Marker
              key={i}
              coordinate={item}
              onPress={!disabled ? handleMarkerClick : null}>
              <View
                style={
                  disabled ? styles.customMarkerDisabled : styles.customMarker
                }
              />
            </Marker>
          );
        })}

        <Marker coordinate={car_status.location}>
          <Image
            source={require('../assests/images/logo_car_80x72.png')}
            style={styles.carMarker}
            resizeMode="contain"
          />
        </Marker>

        <Polyline coordinates={route} strokeWidth={2} strokeColor="red" />
      </MapView>

      <MyButton
        style={styles.rasberryButton}
        text={t('emulate_rasberry_call')}
        disabled={
          !selectedSlot ||
          destination.status !== RECORDS_STATUS.RESERVED ||
          selectedSlot.status !== SLOT_STATUS.IDLE
        }
        onPress={handleRasberryClick}
        loading={rasberryEmulation}
      />

      {showModal && <ProcessModal visible={showModal} />}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
  },

  map: {
    flex: 1,
  },

  customMarker: {
    width: 20,
    height: 20,
    borderRadius: 50,
    backgroundColor: primaryColor,
  },

  customMarkerDisabled: {
    width: 20,
    height: 20,
    borderRadius: 50,
    backgroundColor: 'gray',
  },

  car: {
    width: 30,
    height: 30,
    borderRadius: 50,
  },

  rasberryButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 200,
  },

  moreButton: {
    marginRight: 4,
    paddingRight: 4,
    paddingLeft: 4,
  },

  carMarker: {
    width: 24,
    height: 24,
  },
});
