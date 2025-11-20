import React from 'react';
import {
  getCurrentMonthTransactions,
  calculateIncome,
  calculateExpenses
} from '../../utils/calculations';

const MonthComparison = ({ transactions }) => {
  const curr = getCurrentMonthTransactions(transactions);

  const income = calculateIncome(curr);
  const expenses = calculateExpenses(curr);
  const net = income - expenses;

  const rows = [
    { label: "Income", value: income },
    { label: "Expenses", value: expenses },
    { label: "Net", value: net }
  ];

  return (
    <>
      <h3 className="section-title">This Month</h3>

      <div className="tx-list">
        {rows.map((r, i) => (
          <div key={i} className="tx-row">
            <span className="tx-label">{r.label}</span>
            <span className={`tx-value ${r.value < 0 ? "tx-red" : "tx-green"}`}>
              ₹{r.value.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </>
  );
};

export default MonthComparison;
