import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ensureFirebaseSession } from './firebase';

ensureFirebaseSession().catch((error) => {
  console.error('Firebase session initialization failed.', error);
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
