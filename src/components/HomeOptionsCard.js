import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import CardView from './CardView';
import MyCircularIconButton from './CircularIconButton';
import { useTranslation } from 'react-multi-lang';
import { useSelector } from 'react-redux';

export default function HomeOptionsCard(props) {
  const t = useTranslation();
  const { vehiculo } = useSelector(state => state.app);
  return (
    <CardView style={{ ...styles.root, ...props.style }}>
      <MyCircularIconButton
        icon_name="search"
        text={t('query')}
        onPress={props.onQueryClick}
      />
      <MyCircularIconButton
        icon_name="car"
        text={t('start_park')}
        onPress={props.onParkingClick}
        disabled={!vehiculo}
      />
      <MyCircularIconButton
        icon_name="thumbs-up"
        text={t('about')}
        onPress={props.onAboutClick}
      />
    </CardView>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

HomeOptionsCard.propTypes = {
  onQueryClick: PropTypes.func.isRequired,
  onParkingClick: PropTypes.func.isRequired,
  onAboutClick: PropTypes.func.isRequired,
  style: PropTypes.object,
};
