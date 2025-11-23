import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NewBatch from './pages/NewBatch';
import BatchDetails from './pages/BatchDetails';
import Settings from './pages/Settings';

// Helper to handle root path logic
// If there's a hash (Magic Link token), go to Login to process it.
// Otherwise, go to Dashboard.
const RootHandler: React.FC = () => {
  const location = useLocation();
  
  // Check if the URL contains a hash with access_token (Supabase Magic Link)
  if (location.hash && location.hash.includes('access_token')) {
    // Pass current location (including hash) to login page
    return <Navigate to="/login" replace={false} />;
  }

  return <Navigate to="/dashboard" replace />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/new-batch" element={<NewBatch />} />
          <Route path="/batch/:id" element={<BatchDetails />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/" element={<RootHandler />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;