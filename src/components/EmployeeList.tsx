import React, { useState } from 'react';
import '../styles/employee-list.css';

type Status = 'Active' | 'Probation' | 'Contract';

type Employee = {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  hireDate: string;
  status: Status;
};

const initialEmployees: Employee[] = [
  {
    id: 1,
    name: 'Ada Lovelace',
    email: 'ada@company.com',
    department: 'Engineering',
    role: 'Software Engineer',
    hireDate: '2024-01-15',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Grace Hopper',
    email: 'grace@company.com',
    department: 'Engineering',
    role: 'System Architect',
    hireDate: '2023-11-01',
    status: 'Probation',
  },
];

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [newEmployee, setNewEmployee] = useState<Employee>({
    id: Date.now(),
    name: '',
    email: '',
    department: '',
    role: '',
    hireDate: '',
    status: 'Active',
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortAsc, setSortAsc] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmployees([...employees, { ...newEmployee, id: Date.now() }]);
    setNewEmployee({
      id: Date.now(),
      name: '',
      email: '',
      department: '',
      role: '',
      hireDate: '',
      status: 'Active',
    });
  };

  // 🔍 Filtering and sorting
  const filteredEmployees = employees
    .filter(emp =>
      (emp.name + emp.email).toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter ? emp.status === statusFilter : true)
    )
    .sort((a, b) => {
      if (a.name < b.name) return sortAsc ? -1 : 1;
      if (a.name > b.name) return sortAsc ? 1 : -1;
      return 0;
    });

  return (
    <div className="employee-list">
      <h2>Add New Employee</h2>
      <form onSubmit={handleSubmit} className="employee-form">
        <input type="text" name="name" value={newEmployee.name} onChange={handleChange} placeholder="Name" required />
        <input type="email" name="email" value={newEmployee.email} onChange={handleChange} placeholder="Email" required />
        <input type="text" name="department" value={newEmployee.department} onChange={handleChange} placeholder="Department" required />
        <input type="text" name="role" value={newEmployee.role} onChange={handleChange} placeholder="Role" required />
        <input type="date" name="hireDate" value={newEmployee.hireDate} onChange={handleChange} required />
        <select name="status" value={newEmployee.status} onChange={handleChange}>
          <option value="Active">Active</option>
          <option value="Probation">Probation</option>
          <option value="Contract">Contract</option>
        </select>
        <button type="submit">Add Employee</button>
      </form>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by name or email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Probation">Probation</option>
          <option value="Contract">Contract</option>
        </select>
        <button onClick={() => setSortAsc(!sortAsc)}>
          Sort {sortAsc ? '↓ Z-A' : '↑ A-Z'}
        </button>
      </div>

      <h2>All Employees</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Role</th>
            <th>Hire Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredEmployees.map(emp => (
            <tr key={emp.id}>
              <td>{emp.name}</td>
              <td>{emp.email}</td>
              <td>{emp.department}</td>
              <td>{emp.role}</td>
              <td>{emp.hireDate}</td>
              <td>
                <span className={`status ${emp.status.toLowerCase()}`}>
                  {emp.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;