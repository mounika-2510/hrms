import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import EmployeeForm from '../components/EmployeeForm';
import api from '../services/api';
import './Employees.css';

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const response = await api.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error loading employees:', error);
      alert('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    try {
      await api.delete(`/employees/${id}`);
      setEmployees(employees.filter(emp => emp.id !== id));
      alert('Employee deleted successfully');
    } catch (error) {
      console.error('Error deleting employee:', error);
      alert('Failed to delete employee');
    }
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingEmployee(null);
  };

  const handleFormSuccess = () => {
    loadEmployees();
    handleFormClose();
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container">
          <div className="loading">Loading employees...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="page-header">
          <h1>Employees Management</h1>
          <button 
            className="btn-primary" 
            onClick={() => setShowForm(true)}
          >
            + Add New Employee
          </button>
        </div>

        {showForm && (
          <EmployeeForm
            employee={editingEmployee}
            onClose={handleFormClose}
            onSuccess={handleFormSuccess}
          />
        )}

        {employees.length === 0 ? (
          <div className="no-data">
            <p>No employees found. Create your first employee!</p>
          </div>
        ) : (
          <div className="cards-grid">
            {employees.map((employee) => (
              <div key={employee.id} className="card">
                <div className="card-header">
                  <div>
                    <h3 className="card-title">
                      {employee.first_name} {employee.last_name}
                    </h3>
                    <p className="card-subtitle">{employee.email}</p>
                    {employee.phone && (
                      <p className="card-subtitle">📞 {employee.phone}</p>
                    )}
                    {employee.Teams && employee.Teams.length > 0 && (
                      <div className="badges">
                        {employee.Teams.map(team => (
                          <span key={team.id} className="badge">
                            {team.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="card-actions">
                  <button 
                    className="btn-secondary" 
                    onClick={() => handleEdit(employee)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-danger" 
                    onClick={() => handleDelete(employee.id)}
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

export default Employees;