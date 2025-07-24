import React, { useState, useEffect } from 'react';
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
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('employees');
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Employee>({
    id: Date.now(),
    name: '',
    email: '',
    department: '',
    role: '',
    hireDate: '',
    status: 'Active',
  });

  // Save to localStorage when employees list changes
  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && editId !== null) {
      setEmployees(prev =>
        prev.map(emp => (emp.id === editId ? { ...formData, id: editId } : emp))
      );
      setIsEditing(false);
      setEditId(null);
    } else {
      setEmployees(prev => [...prev, { ...formData, id: Date.now() }]);
    }

    setFormData({
      id: Date.now(),
      name: '',
      email: '',
      department: '',
      role: '',
      hireDate: '',
      status: 'Active',
    });
  };

  const handleEdit = (employee: Employee) => {
    setIsEditing(true);
    setEditId(employee.id);
    setFormData({ ...employee });
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this employee?')) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    }
  };

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

    const exportToCSV = () => {
        const headers = ["Name", "Email", "Department", "Role", "Hire Date", "Status"];
        const rows = employees.map(emp => [
            emp.name,
            emp.email,
            emp.department,
            emp.role,
            emp.hireDate,
            emp.status
        ]);
    
        const csvContent = [
            headers.join(","), // First line: column headers
            ...rows.map(row => row.join(",")) // Other lines: employee data
        ].join("\n");
    
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
    
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", "employees.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="employee-list">
            <div className="dashboard-summary-container">

                {/* Dashboard Summary */}
                <div className="dashboard-summary">
                    <div>Total Employees: {employees.length}</div>
                    <div>
                        Active: {employees.filter(emp => emp.status === 'Active').length} |{' '}
                        Probation: {employees.filter(emp => emp.status === 'Probation').length} |{' '}
                        Contract: {employees.filter(emp => emp.status === 'Contract').length}
                    </div>
                    <div>
                        Hired This Month:{' '}
                        {
                            employees.filter(emp => {
                                const hire = new Date(emp.hireDate);
                                const now = new Date();
                                return (
                                    hire.getMonth() === now.getMonth() &&
                                    hire.getFullYear() === now.getFullYear()
                                );
                            }).length
                        }
                    </div>
                </div>



                <h2>{isEditing ? 'Edit Employee' : 'Add New Employee'}</h2>

                <form onSubmit={handleSubmit} className="employee-form">
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Name"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                    />
                    <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        placeholder="Department"
                        required
                    />
                    <input
                        type="text"
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        placeholder="Role"
                        required
                    />
                    <input
                        type="date"
                        name="hireDate"
                        value={formData.hireDate}
                        onChange={handleChange}
                        required
                    />
                    <select name="status" value={formData.status} onChange={handleChange}>
                        <option value="Active">Active</option>
                        <option value="Probation">Probation</option>
                        <option value="Contract">Contract</option>
                    </select>
                    <button type="submit">{isEditing ? 'Update' : 'Add'} Employee</button>
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
            </div>

            <button className="download-btn" onClick={exportToCSV}>
                Download data
            </button>
            {/* Employee Table */}
            <table className="employee-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Role</th>
                        <th>Hire Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredEmployees.map(employee => (
                        <tr key={employee.id}>
                            <td>{employee.name}</td>
                            <td>{employee.email}</td>
                            <td>{employee.department}</td>
                            <td>{employee.role}</td>
                            <td>{employee.hireDate}</td>
                            <td>{employee.status}</td>
                            <td>
                                <button className="edit-btn" onClick={() => handleEdit(employee)}>Edit</button>
                                <button className="delete-btn" onClick={() => handleDelete(employee.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default EmployeeList;