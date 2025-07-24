import React from 'react';
import '../styles/layout.css';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="layout">
      <aside className="sidebar">
        <h2>HR Dashboard</h2>
        <nav>
          <ul>
            <li>Employees</li>
            <li>Departments</li>
            <li>Reports</li>
            <li>Settings</li>
          </ul>
        </nav>
      </aside>
      <main className="main">
        <header className="header">
          <h1>Employee Management</h1>
        </header>
        <section className="content">
          {children}
        </section>
      </main>
    </div>
  );
};

export default DashboardLayout;