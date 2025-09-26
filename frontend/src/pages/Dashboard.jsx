import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Pilih Project Site</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Link to="/tablelist/Head Office">
          <div className="p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-2xl font-bold mb-4">Head Office</h2>
            <p className="text-gray-600">Lihat data untuk Head Office</p>
          </div>
        </Link>
        <Link to="/tablelist/Bekasi">
          <div className="p-8 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-2xl font-bold mb-4">Bekasi</h2>
            <p className="text-gray-600">Lihat data untuk Bekasi</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;