import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SelectedNodesProvider } from './contexts/SelectedNodesContext'
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SelectedNodesProvider>
      <App />
    </SelectedNodesProvider>
  </React.StrictMode>,
)
