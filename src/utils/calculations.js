export const getCurrentMonthTransactions = (transactions) => {
  const now = new Date();
  return transactions.filter(t => {
    const tDate = new Date(t.date);
    return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
  });
};

export const getPreviousMonthTransactions = (transactions) => {
  const now = new Date();
  const prevMonth = now.getMonth() - 1;
  const year = prevMonth < 0 ? now.getFullYear() - 1 : now.getFullYear();
  const month = prevMonth < 0 ? 11 : prevMonth;
  
  return transactions.filter(t => {
    const tDate = new Date(t.date);
    return tDate.getMonth() === month && tDate.getFullYear() === year;
  });
};

export const calculateIncome = (transactions) => {
  return transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
};

export const calculateExpenses = (transactions) => {
  return Math.abs(transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + t.amount, 0));
};

export const calculateBalance = (transactions) => {
  return transactions.reduce((sum, t) => sum + t.amount, 0);
};