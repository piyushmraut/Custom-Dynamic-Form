import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import formBuilderReducer from './formBuilderSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['formBuilder'], // only formBuilder will be persisted
};

const rootReducer = combineReducers({
  formBuilder: formBuilderReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);