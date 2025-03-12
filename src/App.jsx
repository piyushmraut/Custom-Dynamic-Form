import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Routes, Route } from 'react-router-dom';
import { store, persistor } from './store';
import HomePage from './components/HomePage'; // New import
import FormBuilder from './components/FormBuilder';
import FormFiller from './components/FormFiller';
import './index.css'

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/builder" element={<FormBuilder />} />
          <Route path="/form/:formId" element={<FormFiller />} />
        </Routes>
      </PersistGate>
    </Provider>
  );
}

export default App;