import React from 'react';

const RecentTransactions = ({ transactions }) => {
  const recent = transactions.slice(0, 5);

  const fmt = (d) => {
    if (!d) return '—';
    if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
      const [y, m, day] = d.split('-').map(Number);
      const local = new Date(y, m - 1, day);
      if (!Number.isNaN(local.getTime())) return local.toLocaleDateString();
      return d;
    }
    const parsed = new Date(d);
    return Number.isNaN(parsed.getTime()) ? d : parsed.toLocaleDateString();
  };

  return (
    <>
      <div className="tx-list">
        {recent.length === 0 ? (
          <p className="muted">No recent transactions</p>
        ) : (
          recent.map((t) => (
            <div key={t.id} className="tx-row">
              <div>
                <strong>{t.category}</strong> • {t.description}
                <div className="tx-date">{fmt(t.date)}</div>
              </div>

              <span className={`tx-value ${t.amount < 0 ? "tx-red" : "tx-green"}`}>
                {t.amount < 0 ? "-" : "+"}₹{Math.abs(t.amount).toFixed(2)}
              </span>
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default RecentTransactions;