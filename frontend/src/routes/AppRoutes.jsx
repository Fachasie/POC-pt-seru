import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TableList from '../components/TableList';
import JobOrderDetail from '../components/JobOrderDetail';
import JobOrderUpdate from '../components/JobOrderUpdate';
import JobOrderCreate from '../components/JobOrderCreate';
import Login from '../pages/Login';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><TableList /></PrivateRoute>} />
      <Route path="/job-orders" element={<PrivateRoute><TableList /></PrivateRoute>} />
      <Route path="/job-order/:id" element={<PrivateRoute><JobOrderDetail /></PrivateRoute>} />
      <Route path="/job-order/update/:id" element={<PrivateRoute><JobOrderUpdate /></PrivateRoute>} />
      <Route path="/job-order/create" element={<PrivateRoute><JobOrderCreate /></PrivateRoute>} />
    </Routes>
  );
};

export default AppRoutes;