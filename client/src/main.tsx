import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App.tsx'
import AdminPage from './pages/AdminPage.tsx'
import ReschedulePage from './pages/ReschedulePage.tsx'
import CancelledPage from './pages/CancelledPage.tsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/reschedule" element={<ReschedulePage />} />
        <Route path="/cancelled" element={<CancelledPage />} />
        <Route path="*" element={
          <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-700 mb-2">404 — Page Not Found</h1>
              <a href="/" className="text-indigo-600 hover:text-indigo-800 text-sm">← Go back home</a>
            </div>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
