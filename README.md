# 🏢 HRMS - Human Resource Management System

A full-stack web application for managing employees and teams with authentication, CRUD operations, and audit logging.

## ✨ Features

- *🔐 Authentication & Authorization*
  - JWT-based authentication
  - Organization-based multi-tenancy
  - Secure password hashing with bcrypt

- *👥 Employee Management*
  - Create, read, update, and delete employees
  - Employee profile management
  - Search and filter capabilities

- *👨‍👩‍👧‍👦 Team Management*
  - Create and manage teams
  - Assign employees to multiple teams
  - Team description and details

- *🔗 Employee-Team Relationships*
  - Many-to-many relationships
  - Flexible team assignments
  - Assignment history tracking

- *📊 Audit Logging*
  - Comprehensive activity tracking
  - User action monitoring
  - System operation logs

- *🎨 Modern UI/UX*
  - Responsive design
  - Intuitive user interface
  - Professional styling

## 🛠 Tech Stack

### Frontend
- *React* - UI framework
- *React Router DOM* - Routing
- *Axios* - HTTP client
- *CSS3* - Styling

### Backend
- *Node.js* - Runtime environment
- *Express.js* - Web framework
- *SQLite* - Database
- *Sequelize* - ORM
- *JWT* - Authentication
- *bcrypt* - Password hashing

## 🌐 API Endpoints
Authentication
POST /api/auth/register - Register new organization

POST /api/auth/login - User login

POST /api/auth/logout - User logout

## Employees
GET /api/employees - List all employees

GET /api/employees/:id - Get employee details

POST /api/employees - Create new employee

PUT /api/employees/:id - Update employee

DELETE /api/employees/:id - Delete employee

## Teams
GET /api/teams - List all teams

GET /api/teams/:id - Get team details

POST /api/teams - Create new team

PUT /api/teams/:id - Update team

DELETE /api/teams/:id - Delete team

POST /api/teams/:id/assign - Assign employee to team

POST /api/teams/:id/unassign - Unassign employee from team

Logs
GET /api/logs - Get audit logs (with optional filters)

## 🗃 Database Schema
The application uses the following main tables:

organisations - Company/organization details

users - System users with authentication

employees - Employee records

teams - Team definitions

employee_teams - Many-to-many relationship table

logs - Audit trail and system logs


## 📁 Project Structure
```
hrms/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── employeeController.js
│   │   │   ├── teamController.js
│   │   │   └── logController.js
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── index.js
│   │   │   ├── organisation.js
│   │   │   ├── user.js
│   │   │   ├── employee.js
│   │   │   ├── team.js
│   │   │   ├── employeeTeam.js
│   │   │   └── log.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   ├── employees.js
│   │   │   ├── teams.js
│   │   │   └── logs.js
│   │   └── index.js
│   ├── .env
│   ├── .gitignore
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── EmployeeForm.jsx
│   │   │   ├── TeamForm.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   └── Forms.css
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── RegisterOrg.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Employees.jsx
│   │   │   ├── Teams.jsx
│   │   │   ├── Auth.css
│   │   │   ├── Dashboard.css
│   │   │   ├── Employees.css
│   │   │   └── Teams.css
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   ├── .env
│   ├── .gitignore
│   └── package.json
└── README.md
```

## 📄 License
This project is licensed under the MIT License.

## 👥 Contributing
Fork the repository

Create a feature branch

Commit your changes

Push to the branch

Create a Pull Request

## Happy Coding! 🚀
