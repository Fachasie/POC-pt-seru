import React from 'react';
import { Routes, Route } from 'react-router-dom';
import TableList from '../components/TableList';
import JobOrderDetail from '../components/JobOrderDetail';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<TableList />} />
      <Route path="/job-order/:id" element={<JobOrderDetail />} />
    </Routes>
  );
};

export default AppRoutes;