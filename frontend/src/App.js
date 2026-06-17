import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ReportIssue from './pages/ReportIssue';
import IssueDetail from './pages/IssueDetail';
import { useAuth } from './context/AuthContext';

const App = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/report" element={user ? <ReportIssue /> : <Navigate to="/login" />} />
        <Route path="/issue/:id" element={user ? <IssueDetail /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
};

export default App;