const dummyData = [
{ id: 1, date: new Date().toISOString().split('T')[0], category: 'Salary', description: 'Monthly salary', amount: 50000, type: 'income', account: 'Bank' },
{ id: 2, date: new Date().toISOString().split('T')[0], category: 'Rent', description: 'Monthly rent', amount: -15000, type: 'expense', account: 'Bank' },
{ id: 3, date: new Date().toISOString().split('T')[0], category: 'Fuel', description: 'Petrol station', amount: -1200.5, type: 'expense', account: 'Card' },
{ id: 4, date: new Date(new Date().setDate(new Date().getDate() - 10)).toISOString().split('T')[0], category: 'Eating out', description: 'Dinner with friends', amount: -800, type: 'expense', account: 'Wallet' },
{ id: 5, date: new Date(new Date().setMonth(new Date().getMonth()-1)).toISOString().split('T')[0], category: 'Rent', description: 'Previous month rent', amount: -15000, type: 'expense', account: 'Bank' }
];


export default dummyData;