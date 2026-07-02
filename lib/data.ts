export interface User {
  id: string;
  userId: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  transactionKey: string;
  memberSince: string;
  accountNumber: string;
  routingNumber: string;
  cardLast4: string;
  cardExpiry: string;
  cardType: 'visa' | 'mastercard';
}

export function hashPassword(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = (Math.imul(h, 33) ^ s.charCodeAt(i)) >>> 0;
  return h.toString(16);
}

export const PREDEFINED_USERS: User[] = [
  {
    id: 'usr_robin_001',
    userId: 'robin.hayes',
    password: hashPassword('BofA2024!'),
    firstName: 'Robin',
    lastName: 'Hayes',
    email: 'frontenddev177@gmail.com',
    phone: '***-***-4521',
    avatar: '/ayes.jpg',
    transactionKey: 'A',
    memberSince: '2018-03-15',
    accountNumber: '****4521',
    routingNumber: '026009593',
    cardLast4: '4521',
    cardExpiry: '09/27',
    cardType: 'visa',
  },
  {
    id: 'usr_courtney_002',
    userId: 'courtney.henry',
    password: hashPassword('BofA2024!'),
    firstName: 'Courtney',
    lastName: 'Henry',
    email: 'frontenddev177@gmail.com',
    phone: '***-***-7645',
    avatar: '/rob.jpg',
    transactionKey: 'B',
    memberSince: '2020-07-22',
    accountNumber: '****7645',
    routingNumber: '026009593',
    cardLast4: '7645',
    cardExpiry: '06/26',
    cardType: 'mastercard',
  },
  {
    id: 'usr_anna_003',
    userId: 'anna.olson',
    password: hashPassword('BofA2024!'),
    firstName: 'Anna',
    lastName: 'Olson',
    email: 'codewitmui@gmail.com',
    phone: '***-***-0008',
    avatar: '/olon.jpg',
    transactionKey: 'C',
    memberSince: '2019-11-05',
    accountNumber: '****0008',
    routingNumber: '026009593',
    cardLast4: '0008',
    cardExpiry: '08/25',
    cardType: 'mastercard',
  },
];

const BALANCES: Record<string, { checking: number; savings: number; rewards: number; spending: number }> = {
  A: { checking: 4000.00, savings: 85000.00, rewards: 2543.21, spending: 3174.01 },
  B: { checking: 15354.00, savings: 106500.00, rewards: 9354.00, spending: 5820.60 },
  C: { checking: 50000.00, savings: 12000.00, rewards: 5230.00, spending: 4299.00 },
};

export function getBalance(key: string) {
  return BALANCES[key] ?? BALANCES['A'];
}

export function formatCurrency(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

export function formatDate(d: string) {
  return new Date(d + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  category: string;
  amount: number;
  type: 'debit' | 'credit';
  icon: string;
}

const TRANSACTIONS_MAP: Record<string, Transaction[]> = {
  A: [
    { id: 't1', date: '2026-06-20', merchant: 'Uber Eats', category: 'Delivery', amount: -28.60, type: 'debit', icon: 'uber' },
    { id: 't2', date: '2026-06-20', merchant: 'Lyft', category: 'Transport', amount: -10.49, type: 'debit', icon: 'lyft' },
    { id: 't3', date: '2026-06-20', merchant: 'Apple Store', category: 'Electronics', amount: -390.99, type: 'credit', icon: 'apple' },
    { id: 't4', date: '2026-06-19', merchant: 'Amazon', category: 'Shopping', amount: -55.40, type: 'debit', icon: 'amazon' },
    { id: 't5', date: '2026-06-19', merchant: 'Starbucks', category: 'Food & Drink', amount: -8.60, type: 'debit', icon: 'starbucks' },
    { id: 't6', date: '2026-06-18', merchant: 'Airbnb', category: 'Travel', amount: -205.60, type: 'credit', icon: 'airbnb' },
    { id: 't7', date: '2026-06-18', merchant: 'Nike Store', category: 'Shopping', amount: -149.59, type: 'debit', icon: 'nike' },
    { id: 't8', date: '2026-06-17', merchant: 'Direct Deposit', category: 'Payroll', amount: +2850.00, type: 'debit', icon: 'deposit' },
    { id: 't9', date: '2026-06-17', merchant: 'Netflix', category: 'Subscription', amount: -15.99, type: 'credit', icon: 'netflix' },
    { id: 't10', date: '2026-06-16', merchant: 'Walmart', category: 'Grocery', amount: -67.43, type: 'debit', icon: 'walmart' },
  ],
  B: [
    { id: 't1', date: '2026-06-20', merchant: 'Apple Store', category: 'Electronics', amount: -390.99, type: 'credit', icon: 'apple' },
    { id: 't2', date: '2026-06-20', merchant: 'Starbucks', category: 'Food & Drink', amount: -8.60, type: 'debit', icon: 'starbucks' },
    { id: 't3', date: '2026-06-19', merchant: 'Bank of America', category: 'Transfer', amount: -10.99, type: 'debit', icon: 'bofa' },
    { id: 't4', date: '2026-06-19', merchant: 'Amazon', category: 'Shopping', amount: -390.99, type: 'credit', icon: 'amazon' },
    { id: 't5', date: '2026-06-18', merchant: 'Airbnb', category: 'Travel', amount: -205.60, type: 'debit', icon: 'airbnb' },
    { id: 't6', date: '2026-06-17', merchant: 'Direct Deposit', category: 'Payroll', amount: +5500.00, type: 'debit', icon: 'deposit' },
    { id: 't7', date: '2026-06-17', merchant: 'AT&T', category: 'Utilities', amount: -16.00, type: 'debit', icon: 'att' },
    { id: 't8', date: '2026-06-16', merchant: 'Spotify', category: 'Subscription', amount: -9.99, type: 'credit', icon: 'spotify' },
    { id: 't9', date: '2026-06-15', merchant: 'Target', category: 'Shopping', amount: -124.50, type: 'debit', icon: 'target' },
    { id: 't10', date: '2026-06-14', merchant: 'Whole Foods', category: 'Grocery', amount: -89.20, type: 'debit', icon: 'wholefoods' },
  ],
  C: [
    { id: 't1', date: '2026-06-20', merchant: 'Apple', category: 'Electronics', amount: -799.00, type: 'credit', icon: 'apple' },
    { id: 't2', date: '2026-06-19', merchant: 'New Balance', category: 'Fashion', amount: -87.00, type: 'debit', icon: 'newbalance' },
    { id: 't3', date: '2026-06-18', merchant: 'Spotify', category: 'Subscription', amount: -45.00, type: 'credit', icon: 'spotify' },
    { id: 't4', date: '2026-06-17', merchant: 'Dropbox', category: 'Software', amount: +23.80, type: 'debit', icon: 'dropbox' },
    { id: 't5', date: '2026-06-16', merchant: 'Uber Eats', category: 'Delivery', amount: -34.50, type: 'debit', icon: 'uber' },
    { id: 't6', date: '2026-06-15', merchant: 'Direct Deposit', category: 'Payroll', amount: +6200.00, type: 'debit', icon: 'deposit' },
    { id: 't7', date: '2026-06-14', merchant: 'Amazon', category: 'Shopping', amount: -230.00, type: 'credit', icon: 'amazon' },
    { id: 't8', date: '2026-06-13', merchant: 'Starbucks', category: 'Food & Drink', amount: -12.40, type: 'debit', icon: 'starbucks' },
    { id: 't9', date: '2026-06-12', merchant: 'Netflix', category: 'Subscription', amount: -15.99, type: 'credit', icon: 'netflix' },
    { id: 't10', date: '2026-06-11', merchant: 'Gas Station', category: 'Transport', amount: -68.00, type: 'debit', icon: 'gas' },
  ],
};

export function getTransactions(key: string): Transaction[] {
  return TRANSACTIONS_MAP[key] ?? TRANSACTIONS_MAP['A'];
}

export interface Payee {
  id: string;
  name: string;
  category: string;
  accountLast4: string;
}

const PAYEES_MAP: Record<string, Payee[]> = {
  A: [
    { id: 'p1', name: 'AT&T', category: 'Utilities', accountLast4: '8821' },
    { id: 'p2', name: 'ComEd Electric', category: 'Utilities', accountLast4: '4430' },
    { id: 'p3', name: 'Xfinity', category: 'Internet', accountLast4: '2219' },
  ],
  B: [
    { id: 'p1', name: 'Verizon', category: 'Utilities', accountLast4: '5512' },
    { id: 'p2', name: 'Duke Energy', category: 'Utilities', accountLast4: '3301' },
    { id: 'p3', name: 'T-Mobile', category: 'Mobile', accountLast4: '7788' },
  ],
  C: [
    { id: 'p1', name: 'AT&T', category: 'Utilities', accountLast4: '2290' },
    { id: 'p2', name: 'Spotify', category: 'Subscription', accountLast4: '4456' },
    { id: 'p3', name: 'Netflix', category: 'Subscription', accountLast4: '9901' },
  ],
};

export function getPayees(key: string): Payee[] {
  return PAYEES_MAP[key] ?? PAYEES_MAP['A'];
}
