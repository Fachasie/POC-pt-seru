import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TableList from '../components/TableList';
import JobOrderDetail from '../components/JobOrderDetail';
import JobOrderUpdate from '../components/JobOrderUpdate';
import JobOrderCreate from '../components/JobOrderCreate';
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<TableList />} />
      <Route path="/job-orders" element={<TableList />} />
      <Route path="/job-order/:id" element={<JobOrderDetail />} />
      <Route path="/job-order/update/:id" element={<JobOrderUpdate />} />
      <Route path="/job-order/create" element={<JobOrderCreate />} />
    </Routes>
  );
};

export default AppRoutes;