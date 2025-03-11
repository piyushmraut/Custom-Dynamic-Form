import React from 'react';
import './index.css'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store';
import FormBuilder from './components/FormBuilder';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <div className="container mx-auto p-4">
          <h1 className="text-3xl font-bold text-center my-6">Custom Dynamic Form Builder</h1>
          <FormBuilder />
        </div>
      </PersistGate>
    </Provider>
  );
}

export default App;