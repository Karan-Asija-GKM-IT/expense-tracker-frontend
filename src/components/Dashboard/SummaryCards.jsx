import React from 'react';
import {
  getCurrentMonthTransactions,
  getPreviousMonthTransactions,
  calculateIncome,
  calculateExpenses,
} from '../../utils/calculations';

/** Simple donut chart with SVG */
const Donut = ({ value, total, size = 92, stroke = 12 }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const safeTotal = Math.max(total, 0.00001);
  const pct = Math.max(0, Math.min(1, value / safeTotal));
  const filled = circumference * pct;
  const empty = circumference - filled;

  return (
    <svg width={size} height={size}>
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        {/* Expenses background ring */}
        <circle
          r={radius}
          fill="transparent"
          stroke="#ef4444"
          strokeWidth={stroke}
          style={{ opacity: 0.15 }}
        />

        {/* Income ring */}
        <circle
          r={radius}
          fill="transparent"
          stroke="#10b981"
          strokeWidth={stroke}
          strokeDasharray={`${filled} ${empty}`}
          transform="rotate(-90)"
        />

        <text x="0" y="4" textAnchor="middle" fontSize="12" fontWeight="700">
          {Math.round(pct * 100)}%
        </text>
      </g>
    </svg>
  );
};

const fmt = (n) =>
  (Number(n) || 0).toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  });

const Arrow = ({ up }) => (
  <span style={{ color: up ? '#059669' : '#dc2626', fontWeight: 700 }}>
    {up ? '▲' : '▼'}
  </span>
);

const SummaryCards = ({ transactions = [] }) => {
  const curr = getCurrentMonthTransactions(transactions);
  const prev = getPreviousMonthTransactions(transactions);

  const currIncome = calculateIncome(curr);
  const currExpenses = calculateExpenses(curr);
  const prevIncome = calculateIncome(prev);
  const prevExpenses = calculateExpenses(prev);

  const currNet = currIncome - currExpenses;
  const prevNet = prevIncome - prevExpenses;

  return (
    <div className="summary-two-grid">
      {/* THIS MONTH */}
      <div className="summary-card">
        <div className="summary-title">This Month</div>

        <div className="summary-row">
          <Donut value={currIncome} total={currIncome + currExpenses} />
          <div>
            <div className="summary-item">
              <span>Income</span>
              <strong>{fmt(currIncome)}</strong>
            </div>

            <div className="summary-item">
              <span>Expenses</span>
              <strong className="red">{fmt(currExpenses)}</strong>
            </div>

            <div className="summary-item">
              <span>Net</span>
              <strong className={currNet >= 0 ? 'green' : 'red'}>
                <Arrow up={currNet >= 0} /> {fmt(currNet)}
              </strong>
            </div>
          </div>
        </div>
      </div>

      {/* LAST MONTH */}
      <div className="summary-card">
        <div className="summary-title">Last Month</div>

        <div className="summary-row">
          <Donut value={prevIncome} total={prevIncome + prevExpenses} />
          <div>
            <div className="summary-item">
              <span>Income</span>
              <strong>{fmt(prevIncome)}</strong>
            </div>

            <div className="summary-item">
              <span>Expenses</span>
              <strong className="red">{fmt(prevExpenses)}</strong>
            </div>

            <div className="summary-item">
              <span>Net</span>
              <strong className={prevNet >= 0 ? 'green' : 'red'}>
                <Arrow up={prevNet >= 0} /> {fmt(prevNet)}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;
