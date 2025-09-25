import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TableList from '../components/TableList';

const API_BASE_URL = 'http://localhost:3001/api';

const Dashboard = () => {
  const [jobOrders, setJobOrders] = useState([]);
  const [projectSites, setProjectSites] = useState([]);
  const [selectedSite, setSelectedSite] = useState('');
  const [filteredJobOrders, setFilteredJobOrders] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobOrdersRes, projectSitesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/job-orders`),
          axios.get(`${API_BASE_URL}/job-orders/project-sites`),
        ]);
        setJobOrders(jobOrdersRes.data);
        setProjectSites(projectSitesRes.data);
        setFilteredJobOrders(jobOrdersRes.data); // Initially show all
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSiteChange = (e) => {
    const siteId = e.target.value;
    setSelectedSite(siteId);

    if (siteId) {
      const filtered = jobOrders.filter(jo => String(jo.project_site_id) === String(siteId));
      setFilteredJobOrders(filtered);
    } else {
      setFilteredJobOrders(jobOrders);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="mb-4">
        <label htmlFor="project-site-filter" className="mr-2">Filter by Project Site:</label>
        <select
          id="project-site-filter"
          value={selectedSite}
          onChange={handleSiteChange}
          className="select select-bordered"
        >
          <option value="">All Sites</option>
          {projectSites.map(site => (
            <option key={site.id} value={site.id}>
              {site.nama}
            </option>
          ))}
        </select>
      </div>
      <TableList jobOrders={filteredJobOrders} />
    </div>
  );
};

export default Dashboard;
