import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import Dashboard from './components/Dashboard/Dashboard';
import CategoryGenerator from './components/Module1/CategoryGenerator';
import ProposalGenerator from './components/Module2/ProposalGenerator';
import PromptLogs from './components/Common/PromptLogs';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 ml-64 mt-16">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/module1" element={<CategoryGenerator />} />
              <Route path="/module2" element={<ProposalGenerator />} />
              <Route path="/logs" element={<PromptLogs />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;