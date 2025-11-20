import React, { useEffect } from 'react';
import NavBar from '../Layout/NavBar';
import SummaryCards from './SummaryCards';
import MonthComparison from './MonthComparison';
import RecentTransactions from './RecentTransactions';
import '../../styles/app.css';

const DashboardPage = ({
  user,
  setUser,
  currentPage,
  setCurrentPage,
  transactions = [],
  setTransactions
}) => {
  const name =
    user?.name || user?.email?.split?.('@')?.[0] || 'there';

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        if (!Array.isArray(transactions) || transactions.length > 0) return;

        const { default: api } = await import('../../utils/api');
        const [catsRes, txRes] = await Promise.all([
          api.get('/categories').catch(() => ({ data: { categories: [] } })),
          api.get('/transactions')
        ]);

        const categories = catsRes?.data?.categories || [];
        const catMap = {};
        categories.forEach(c => {
          if (c && c.id != null) catMap[c.id] = c.name;
        });

        if (mounted && Array.isArray(txRes.data)) {
          const toLocalYMD = val => {
            if (!val) return null;
            if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val)) return val;

            const parsed = new Date(val);
            if (Number.isNaN(parsed.getTime())) return val;

            const y = parsed.getFullYear();
            const m = parsed.getMonth() + 1;
            const d = parsed.getDate();
            return `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
          };

          const normalized = txRes.data.map(tx => ({
            id: tx.id,
            amount: Number(tx.amount),
            category:
              (tx.category_id != null ? catMap[tx.category_id] : null) ||
              tx.category_name ||
              tx.category ||
              '—',
            description: tx.description,
            date: toLocalYMD(tx.date_of_transaction || tx.date),
            type: tx.is_income ? 'income' : 'expense'
          }));

          if (typeof setTransactions === 'function') {
            setTransactions(normalized);
          }
        }
      } catch (err) {
        console.error('Failed to load transactions for dashboard', err);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div>
      {/*  */}
      <NavBar
        user={user}
        setUser={setUser}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setTransactions={setTransactions}
      />

      <main className="app-container">
        <header className="page-header">
          <div>
            <h2 className="section-title">Overview</h2>
            <p className="muted">
              Welcome back,&nbsp;
              <strong>{name?.charAt(0).toUpperCase() + name?.slice(1)}</strong>
            </p>
          </div>
        </header>

        <section className="mb-4">
          <SummaryCards transactions={transactions} />
        </section>

        <section className="grid-2 mb-6">
          <div className="surface-card">
            <MonthComparison transactions={transactions} />
          </div>

          <div className="surface-card">
            <h3 className="section-title">Recent Transactions</h3>
            <RecentTransactions transactions={transactions} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;