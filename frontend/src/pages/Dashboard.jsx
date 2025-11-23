import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    employees: 0,
    teams: 0,
    logs: 0
  });
  const [recentLogs, setRecentLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [employeesRes, teamsRes, logsRes] = await Promise.all([
        api.get('/employees'),
        api.get('/teams'),
        api.get('/logs?limit=10')
      ]);

      setStats({
        employees: employeesRes.data.length,
        teams: teamsRes.data.length,
        logs: logsRes.data.length
      });

      setRecentLogs(logsRes.data.slice(0, 5));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container">
          <div className="loading">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <h1>Dashboard</h1>
        
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-number">{stats.employees}</div>
              <div className="stat-label">Total Employees</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">👨‍👩‍👧‍👦</div>
            <div className="stat-content">
              <div className="stat-number">{stats.teams}</div>
              <div className="stat-label">Active Teams</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <div className="stat-number">{stats.logs}</div>
              <div className="stat-label">System Logs</div>
            </div>
          </div>
        </div>

        <div className="recent-activity">
          <h2>Recent Activity</h2>
          {recentLogs.length === 0 ? (
            <p className="no-data">No recent activity</p>
          ) : (
            <div className="activity-list">
              {recentLogs.map((log) => (
                <div key={log.id} className="activity-item">
                  <div className="activity-badge">{log.action}</div>
                  <div className="activity-details">
                    <div className="activity-user">
                      {log.User?.name || 'System'}
                    </div>
                    <div className="activity-time">
                      {formatDate(log.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;