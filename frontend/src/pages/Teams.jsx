import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import TeamForm from '../components/TeamForm';
import api from '../services/api';
import './Teams.css';

const Teams = () => {
  const [teams, setTeams] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [managingTeam, setManagingTeam] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [teamsRes, employeesRes] = await Promise.all([
        api.get('/teams'),
        api.get('/employees')
      ]);
      setTeams(teamsRes.data);
      setEmployees(employeesRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team?')) {
      return;
    }

    try {
      await api.delete(`/teams/${id}`);
      setTeams(teams.filter(team => team.id !== id));
      alert('Team deleted successfully');
    } catch (error) {
      console.error('Error deleting team:', error);
      alert('Failed to delete team');
    }
  };

  const handleEdit = (team) => {
    setEditingTeam(team);
    setShowForm(true);
  };

  const handleManage = (team) => {
    setManagingTeam(team);
    setSelectedEmployees(team.Employees?.map(e => e.id) || []);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTeam(null);
  };

  const handleFormSuccess = () => {
    loadData();
    handleFormClose();
  };

  const handleManageClose = () => {
    setManagingTeam(null);
    setSelectedEmployees([]);
  };

  const handleEmployeeToggle = (employeeId) => {
        setSelectedEmployees(prev => 
      prev.includes(employeeId)
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const handleSaveAssignments = async () => {
    if (!managingTeam) return;

    try {
      const currentEmployeeIds = managingTeam.Employees?.map(e => e.id) || [];
      
      // Employees to add
      const toAdd = selectedEmployees.filter(id => !currentEmployeeIds.includes(id));
      // Employees to remove
      const toRemove = currentEmployeeIds.filter(id => !selectedEmployees.includes(id));

      // Add new assignments
      for (const employeeId of toAdd) {
        await api.post(`/teams/${managingTeam.id}/assign`, { employeeId });
      }

      // Remove assignments
      for (const employeeId of toRemove) {
        await api.post(`/teams/${managingTeam.id}/unassign`, { employeeId });
      }

      alert('Team assignments updated successfully');
      loadData();
      handleManageClose();
    } catch (error) {
      console.error('Error updating assignments:', error);
      alert('Failed to update team assignments');
    }
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container">
          <div className="loading">Loading teams...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>Teams Management</h1>
          <button 
            className="btn-primary" 
            onClick={() => setShowForm(true)}
          >
            + Create New Team
          </button>
        </div>

        {showForm && (
          <TeamForm
            team={editingTeam}
            onClose={handleFormClose}
            onSuccess={handleFormSuccess}
          />
        )}

        {managingTeam && (
          <div className="modal-overlay" onClick={handleManageClose}>
            <div className="modal-content large" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Manage Team: {managingTeam.name}</h2>
                <button className="close-btn" onClick={handleManageClose}>×</button>
              </div>
              
              <div className="modal-body">
                <p className="modal-description">
                  Select employees to assign to this team:
                </p>
                
                <div className="employees-list">
                  {employees.map(employee => (
                    <label key={employee.id} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(employee.id)}
                        onChange={() => handleEmployeeToggle(employee.id)}
                      />
                      <span className="checkbox-label">
                        {employee.first_name} {employee.last_name} ({employee.email})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn-secondary" 
                  onClick={handleManageClose}
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  className="btn-primary" 
                  onClick={handleSaveAssignments}
                >
                  Save Assignments
                </button>
              </div>
            </div>
          </div>
        )}

        {teams.length === 0 ? (
          <div className="no-data">
            <p>No teams found. Create your first team!</p>
          </div>
        ) : (
          <div className="cards-grid">
            {teams.map((team) => (
              <div key={team.id} className="card">
                <div className="card-header">
                  <div>
                    <h3 className="card-title">{team.name}</h3>
                    {team.description && (
                      <p className="card-subtitle">{team.description}</p>
                    )}
                    <div className="team-stats">
                      <span className="stat">
                        👥 {team.Employees?.length || 0} members
                      </span>
                    </div>
                    
                    {team.Employees && team.Employees.length > 0 && (
                      <div className="member-list">
                        <strong>Members:</strong>
                        <div className="badges">
                          {team.Employees.slice(0, 3).map(employee => (
                            <span key={employee.id} className="badge small">
                              {employee.first_name} {employee.last_name}
                            </span>
                          ))}
                          {team.Employees.length > 3 && (
                            <span className="badge small">
                              +{team.Employees.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="card-actions">
                  <button 
                    className="btn-secondary" 
                    onClick={() => handleEdit(team)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-secondary" 
                    onClick={() => handleManage(team)}
                  >
                    Manage
                  </button>
                  <button 
                    className="btn-danger" 
                    onClick={() => handleDelete(team.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Teams;