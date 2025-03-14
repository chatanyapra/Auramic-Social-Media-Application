import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthContextProvider } from './context/AuthContext.tsx'
import { SocketContextProvider } from './context/SocketContext.tsx'
import { SelectTextContextProvider } from './context/SelectedTextContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <SocketContextProvider>
        <SelectTextContextProvider>
          <App />
        </SelectTextContextProvider>
      </SocketContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
)
