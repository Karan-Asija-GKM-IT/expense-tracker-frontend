export const exportCSV = (transactions, month, year) => {
  const filtered = transactions.filter(t => {
    const tDate = new Date(t.date);
    return tDate.getMonth() === month && tDate.getFullYear() === year;
  });
  
  const csv = [
    ['Date', 'Category', 'Description', 'Amount', 'Type', 'Account'].join(';'),
    ...filtered.map(t => [
      t.date,
      t.category,
      t.description,
      Math.abs(t.amount).toFixed(2),
      t.type,
      t.account
    ].join(';'))
  ].join('\n');
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `transactions_${month + 1}_${year}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};
