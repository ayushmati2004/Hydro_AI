import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App'
import Landing from './pages/Landing'
import About from './pages/About'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Landing/>} />
          <Route path="about" element={<About/>} />
          <Route path="auth" element={<Auth/>} />
            <Route path="dashboard" element={<Dashboard/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
