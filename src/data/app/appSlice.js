import { createSlice } from '@reduxjs/toolkit';

const defaultState = {
  records: [],
  slots: [],
  vehicules: [],
  vehicule: null,
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
    addVehicule: (state, action) => {
      state.vehicules.push(action.payload);
    },
    setVehicules: (state, action) => {
      state.vehicules = action.payload;
      const currentVehicule = action.payload.find(item => item.current);
      if (currentVehicule) {
        state.vehicule = currentVehicule;
      }
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    removeVehicule: (state, action) => {
      state.vehicules = state.vehicules.filter(item => item.id !== action.payload.id);
    },
    updateVehicule: (state, action) => {
      state.vehicules = state.vehicules.map(item => {
        return item.id !== action.payload.id ? item : {
          ...item,
          ...action.payload,
        };
      });
      const currentVehicule = state.vehicules.find(item => item.id === action.payload.id);
      if (currentVehicule) {
        state.vehicule = currentVehicule;
      }
    },
    setVehiculeAsCurrent: (state, action) => {
      let current = null;
      state.vehicules = state.vehicules.map(item => {
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
        state.vehicule = current;
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
  addVehicule,
  setVehicules,
  setUser,
  removeVehicule,
  updateVehicule,
  setVehiculeAsCurrent,
  setSlots,
  setRecords,
  addRecord,
  updateRecord,
  setPermissions,
} = slice.actions;

