import { createSlice } from '@reduxjs/toolkit';

const defaultState = {
  records: [],
  slots: [],
  vehiculos: [],
  vehiculo: null,
  user: null,
  car_status: {
    status: 'inactivo',
    date: '',
    begin_date: '',
    end_date: '',
    debt: 0,
    location: {
      latitude: 19.51082,
      longitude: -99.12669,
    },
  },
  permissions: {
    location: '',
  },
};

const slice = createSlice({
  name: 'app',
  initialState: defaultState,
  reducers: {
    setCarLocation: (state, action) => { state.car_status.location = action.payload; },
    addVehiculo: (state, action) => {
      state.vehiculos.push(action.payload);
    },
    setVehiculos: (state, action) => {
      state.vehiculos = action.payload;
      const currentVehiculo = action.payload.find(item => item.current);
      if (currentVehiculo) {
        state.vehiculo = currentVehiculo;
      }
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    removeVehiculo: (state, action) => {
      state.vehiculos = state.vehiculos.filter(item => item.id !== action.payload.id);
    },
    updateVehiculo: (state, action) => {
      state.vehiculos = state.vehiculos.map(item => {
        return item.id !== action.payload.id ? item : {
          ...item,
          ...action.payload,
        };
      });
      const currentVehiculo = state.vehiculos.find(item => item.id === action.payload.id);
      if (currentVehiculo) {
        state.vehiculo = currentVehiculo;
      }
    },
    setVehiculoAsCurrent: (state, action) => {
      let current = null;
      state.vehiculos = state.vehiculos.map(item => {
        const newItemState = {
          ...item,
          current: action.payload.id === item.id,
        };
        if (newItemState.current) {
          current = newItemState;
        }
        return newItemState;
      });
      if (current) {
        state.vehiculo = current;
      }
    },
    setSlots: (state, action) => {
      state.slots = action.payload;
    },
    setRecords: (state, actions) => {
      state.records = actions.payload;
    },
    addRecord: (state, action) => {
      state.records.shift(action.payload);
    },
    updateRecord: (state, action) => {
      state.records = state.records.map((item) => {
        if (item.id === action.payload.id) {
          return action.payload;
        }
        return item;
      });
    },
    setPermissions: (state, action) => {
      state.permissions = {
        ...state.permissions,
        ...action.payload,
      };
    },
  },
});

export default slice.reducer;
export const {
  setCarLocation,
  addVehiculo,
  setVehiculos,
  setUser,
  removeVehiculo,
  updateVehiculo,
  setVehiculoAsCurrent,
  setSlots,
  setRecords,
  addRecord,
  updateRecord,
  setPermissions,
} = slice.actions;

