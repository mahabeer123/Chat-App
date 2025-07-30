
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from "react-router-dom";
import AuthWrapper from './Components/AuthContext.jsx';
import { store } from './store'
import { initializeTheme } from './utils/theme';

// Initialize theme
initializeTheme();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthWrapper>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AuthWrapper>
    </Provider>
  </React.StrictMode>,
)
