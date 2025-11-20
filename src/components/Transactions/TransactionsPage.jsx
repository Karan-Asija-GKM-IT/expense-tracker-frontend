import React, { useState, useMemo, useEffect } from 'react';
import NavBar from '../Layout/NavBar';
import TransactionList from './TransactionList';
import AddTransactionModal from './AddTransactionModal';
import '../../styles/style.css';

const TransactionsPage = ({
  user,
  setUser,
  currentPage,
  setCurrentPage,
  transactions = [],
  setTransactions
}) => {
  // load transactions from backend
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const { default: api } = await import('../../utils/api');
        const userId = (typeof user === 'object' && user && user.id) ? user.id : undefined;
        const txUrl = userId ? `/transactions?userId=${encodeURIComponent(userId)}` : '/transactions';

        const [catsRes, txRes] = await Promise.all([
          api.get('/categories').catch(() => ({ data: { categories: [] } })),
          api.get(txUrl)
        ]);

        const categories = catsRes?.data?.categories || [];
        const catMap = {};
        categories.forEach(c => { if (c && c.id != null) catMap[c.id] = c.name; });

        if (mounted && Array.isArray(txRes.data)) {
          const toLocalYMD = (val) => {
            if (!val) return null;
            
            if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(val)) return val;
            const parsed = new Date(val);
            if (Number.isNaN(parsed.getTime())) return val;
            const y = parsed.getFullYear();
            const m = parsed.getMonth() + 1;
            const d = parsed.getDate();
            return `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
          };

          const normalized = txRes.data.map(tx => ({
            id: tx.id,
            amount: Number(tx.amount),
            category: (tx.category_id != null ? catMap[tx.category_id] : null) || tx.category_name || tx.category || '—',
            description: tx.description,
            date: toLocalYMD(tx.date_of_transaction || tx.date),
            type: tx.is_income ? 'income' : 'expense'
          }));
          setTransactions(normalized);
        }
      } catch (err) {
        console.error('Failed to load transactions', err);
      }
    };
    load();
    return () => { mounted = false; };
  }, []);
  const [showAdd, setShowAdd] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [editingTx, setEditingTx] = useState(null); 

  const parseDay = (d) => {
    if (!d) return null;
    const dt = new Date(d);
    dt.setHours(0,0,0,0);
    return dt;
  };

  
  const filteredTransactions = useMemo(() => {
    const tx = Array.isArray(transactions) ? transactions : [];
    const start = parseDay(fromDate);
    const end = parseDay(toDate);
    if (!start && !end) return tx;

    return tx.filter(t => {
      if (!t?.date) return false;
      const d = new Date(t.date);
      d.setHours(0,0,0,0);
      if (start && end) return d >= start && d <= end;
      if (start) return d >= start;
      if (end) return d <= end;
      return true;
    });
  }, [transactions, fromDate, toDate]);

  const clearDates = () => {
    setFromDate('');
    setToDate('');
  };

  const openAddModal = () => {
    setEditingTx(null);
    setShowAdd(true);
  };

  const handleEdit = (tx) => {
    setEditingTx(tx);
    setShowAdd(true);
  };

  const handleDelete = (id) => {
    const ok = window.confirm('Are you sure you want to delete this transaction? This cannot be undone.');
    if (!ok) return;
    (async () => {
      try {
        const { default: api } = await import('../../utils/api');
        await api.delete(`/transactions/${id}`);
        setTransactions(prev => prev.filter(t => t.id !== id));
      } catch (err) {
        console.error('Failed to delete transaction', err);
        alert('Failed to delete transaction');
      }
    })();
  };

  
  const onModalClose = () => {
    setEditingTx(null);
    setShowAdd(false);
  };

  return (
    <div>
      <NavBar user={user} setUser={setUser} currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="app-container">
        <div className="d-flex align-items-center justify-content-between mb-3 page-header">
          <div>
            <h2 className="section-title">Transactions</h2>
            <p className="muted">Add, filter and review your transactions</p>
          </div>

          <div className="d-flex gap-2 align-items-center">
            <button
              className="btn btn-primary btn-pill d-flex align-items-center"
              onClick={openAddModal}
              title="Add Transaction"
            >
              <span style={{ fontSize: 18, marginRight: 8 }}>＋</span>
              Add Transaction
            </button>
          </div>
        </div>

        {/* Date filter card */}
        <div className="surface-card mb-4">
          <div className="date-row" style={{ display: 'flex', gap: 24, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ minWidth: 220, maxWidth: 320 }}>
              <label className="muted">From</label>
              <input
                type="date"
                className="form-control"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', minWidth: 320, maxWidth: '60%' }}>
              <div style={{ flex: 1 }}>
                <label className="muted">To</label>
                <input
                  type="date"
                  className="form-control"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>

              <div>
                <button className="btn btn-secondary btn-pill" onClick={clearDates}>Clear Dates</button>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <div className="muted">Showing <strong>{filteredTransactions.length}</strong> transaction{filteredTransactions.length !== 1 ? 's' : ''}</div>
          </div>
        </div>

        {/* transactions list */}
        <div className="surface-card">
          <h3 className="section-title">Transactions</h3>
          <TransactionList
            transactions={filteredTransactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </main>

      {showAdd && (
        <AddTransactionModal
          transactionToEdit={editingTx}
          setShowAddTransaction={onModalClose}
          transactions={transactions}
          setTransactions={setTransactions}
          onDelete={(id) => {
            // used when editing modal triggers delete
            handleDelete(id);
            onModalClose();
          }}
        />
      )}
    </div>
  );
};

export default TransactionsPage;