// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import GlobalLayout from './components/Layout/GlobalLayout';
import { ThemeProvider } from '@provider/ThemeProvider/ThemeProvider';
import { store } from './app/store';
import { Provider } from 'react-redux';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
      <ThemeProvider>
        <GlobalLayout>
          <App />
        </GlobalLayout>
      </ThemeProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
