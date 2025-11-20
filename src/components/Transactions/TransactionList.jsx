import React from 'react';

const formatCurrency = (value) => {
  const num = Number(value) || 0;
  
  return num.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const formatDate = (d) => {
  if (!d) return '—';

  
  if (typeof d === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(d)) {
    const [y, m, day] = d.split('-').map(Number);
    const local = new Date(y, m - 1, day);
    if (Number.isNaN(local.getTime())) return d;
    return local.toLocaleDateString();
  }

  const parsed = new Date(d);
  if (Number.isNaN(parsed.getTime())) return d;
  return parsed.toLocaleDateString();
};

const TransactionList = ({ transactions = [], onEdit = () => {}, onDelete = () => {} }) => {
  if (!Array.isArray(transactions) || transactions.length === 0) {
    return <div className="muted">No transactions found</div>;
  }

  return (
    <ul className="tx-list" style={{ padding: 0, margin: 0 }}>
      {transactions.map((t, i) => {
        const amount = Number(t.amount) || 0;
        const positive = amount >= 0;
        const key = t.id ?? i;

        return (
          <li key={key} className="tx-item">
            <div className="tx-left">
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div className="tx-category">{t.category || '—'}</div>
                <div style={{ fontSize: 13, color: '#94a3b8' }}>{t.account ? `• ${t.account}` : null}</div>
              </div>

              <div className="tx-desc">{t.description}</div>
              <div className="tx-meta">{formatDate(t.date)}</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className={`tx-amount ${positive ? 'amount-positive' : 'amount-negative'}`}>
                {positive ? '+' : '-'} ₹{formatCurrency(Math.abs(amount))}
              </div>

              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className="btn btn-secondary btn-pill"
                  title="Edit transaction"
                  onClick={() => onEdit(t)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-expense btn-pill"
                  style={{ padding: '8px 10px' }}
                  title="Delete transaction"
                  onClick={() => onDelete(t.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default TransactionList;