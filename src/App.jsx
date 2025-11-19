import { useState } from 'react';
import LoginPage from './components/Auth/LoginPage';
import './App.css';
import './styles/style.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [transactions, setTransactions] = useState([]);

  // helper to render pages
  const renderPage = () => {
    if (!user) {
      return <LoginPage setUser={setUser} setCurrentPage={setCurrentPage} />;
    }

    const commonProps = {
      user,
      setUser,
      currentPage,
      setCurrentPage,
      transactions,
      setTransactions
    };

    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage {...commonProps} />;
      case 'transactions':
        return <TransactionsPage {...commonProps} />;
      case 'import-export':
        return <ImportExportPage {...commonProps} />;
      default:
        return <DashboardPage {...commonProps} />;
    }
  };

  return (
    <div className="app-shell">
      

      {/* main content */}
      <main className="container my-4">
        <div className="page-card">
          {renderPage()}
        </div>
      </main>

      {/* footer */}
      <footer className="app-footer">
        © {new Date().getFullYear()} Expense Tracker - Simplify your expenses 
      </footer>
    </div>
  );
}