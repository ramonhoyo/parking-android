import { configureStore, combineReducers } from '@reduxjs/toolkit';
import reducer from './auth/authSlice';
import appReducer from './app/appSlice';
const rootReducer = combineReducers({
  app: appReducer,
  auth: reducer,
});

export default configureStore({
  reducer: rootReducer,
},
  null,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
