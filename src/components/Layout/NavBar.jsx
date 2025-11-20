import React from 'react';
import { DollarSign, LogOut } from 'lucide-react';
import '../../styles/style.css';

const NavBar = ({ user, setUser, currentPage, setCurrentPage, setTransactions }) => {
  const handleLogout = async () => {
    try {
      const { default: api } = await import('../../utils/api');

      
      await api.post('auth/logout');

    } catch (err) {
      console.error('Logout failed:', err);
    }

   
    setUser(null);
    setTransactions([]);
    setCurrentPage('login');
  };

  return (
    <header className="app-topbar">
      <div className="app-container">
        <div className="nav-bubble">
          <div className="nav-inner">
            <div className="nav-left">
              <div className="brand-badge">
                <DollarSign color="#fff" size={18} />
              </div>
              <div className="brand-text">Expense Tracker</div>
            </div>

            <nav className="nav-links">
              <button
                className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
                onClick={() => setCurrentPage('dashboard')}
              >
                Overview
              </button>

              <button
                className={`nav-link ${currentPage === 'transactions' ? 'active' : ''}`}
                onClick={() => setCurrentPage('transactions')}
              >
                Transactions
              </button>

              <button
                className={`nav-link ${currentPage === 'import-export' ? 'active' : ''}`}
                onClick={() => setCurrentPage('import-export')}
              >
                Export CSV
              </button>

              {/* */}
              <button className="nav-link logout" onClick={handleLogout}>
                <LogOut size={14} style={{ verticalAlign: 'middle' }} />
                &nbsp;Logout
              </button>
            </nav>

          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;