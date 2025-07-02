import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './Components/AuthContext'; // не забудь импорт
import { FavoritesProvider } from './context/FavoritesContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <FavoritesProvider>
        <App />
      </FavoritesProvider>

    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
