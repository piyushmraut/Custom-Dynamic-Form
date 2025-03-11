import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Routes, Route } from 'react-router-dom';
import { store, persistor } from './store';
import FormBuilder from './components/FormBuilder';
import FormFiller from './components/FormFiller';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Routes>
          <Route
            path="/"
            element={
              <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold text-center my-6">Custom Dynamic Form Builder</h1>
                <FormBuilder />
              </div>
            }
          />
          <Route path="/form/:formId" element={<FormFiller />} />
        </Routes>
      </PersistGate>
    </Provider>
  );
}

export default App;