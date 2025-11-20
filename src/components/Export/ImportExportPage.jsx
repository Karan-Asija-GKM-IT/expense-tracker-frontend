import React, { useMemo, useState } from 'react';
import NavBar from '../Layout/NavBar';
import { exportCSV } from '../../utils/exportCSV';
import '../../styles/style.css';

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const ImportExportPage = ({ user, setUser, currentPage, setCurrentPage, transactions = [] }) => {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const yearOptions = [2023, 2024, 2025, 2026];

  // compute transactions for selected month/year
  const filteredForMonth = useMemo(() => {
    if (!Array.isArray(transactions)) return [];
    return transactions.filter((t) => {
      if (!t?.date) return false;
      const d = new Date(t.date);
      return d.getMonth() === Number(month) && d.getFullYear() === Number(year);
    });
  }, [transactions, month, year]);

  const handleExport = () => {
    if (!filteredForMonth.length) {
      alert('No transactions to export for the selected month.');
      return;
    }
    exportCSV(filteredForMonth, Number(month), Number(year));
  };

  return (
    <div>
      <NavBar user={user} setUser={setUser} currentPage={currentPage} setCurrentPage={setCurrentPage} />

      <main className="app-container" style={{ paddingBottom: 48 }}>
        <div className="mb-2 page-header">
          <h2 className="section-title"> Export </h2>
          <p className="muted">Export transactions for a chosen month.</p>
        </div>

        <div className="surface-card export-card mb-4">
          <div className="row g-3 align-items-end">
            <div className="col-md-3">
              <label className="muted">Month</label>
              <select
                className="form-select"
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
              >
                {MONTH_NAMES.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
            </div>

            <div className="col-md-3">
              <label className="muted">Year</label>
              <select
                className="form-select"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
              >
                {yearOptions.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <div className="col-md-4">
              <div className="muted" style={{ marginTop: 6 }}>
                {filteredForMonth.length > 0
                  ? `${filteredForMonth.length} transaction${filteredForMonth.length !== 1 ? 's' : ''} selected`
                  : 'No transactions for this month'}
              </div>
            </div>

            <div className="col-md-2 text-md-end">
              <button
                className="btn btn-primary btn-pill export-btn"
                onClick={handleExport}
                disabled={!filteredForMonth.length}
                title={filteredForMonth.length ? 'Export CSV for selected month' : 'No transactions to export'}
              >
                ⤓ Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* small note / summary */}
        <div className="muted" style={{ maxWidth: 760 }}>
          Tip: Exported CSV uses semicolon (;) as separator to avoid conflicts with decimal commas.
        </div>
      </main>
    </div>
  );
};

export default ImportExportPage;