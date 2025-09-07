import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// A linha abaixo é a mais importante.
// Garanta que ela existe e não está comentada.
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)