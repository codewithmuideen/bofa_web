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

// Deterministic PRNG (mulberry32) — same seed always produces the same sequence,
// which keeps server-rendered and client-hydrated transaction lists identical.
function mulberry32(seed: number) {
  return function random() {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const MERCHANTS: { merchant: string; category: string; icon: string; min: number; max: number }[] = [
  { merchant: 'Uber Eats', category: 'Delivery', icon: 'uber', min: 14, max: 55 },
  { merchant: 'Lyft', category: 'Transport', icon: 'lyft', min: 8, max: 32 },
  { merchant: 'Apple Store', category: 'Electronics', icon: 'apple', min: 20, max: 650 },
  { merchant: 'Amazon', category: 'Shopping', icon: 'amazon', min: 15, max: 260 },
  { merchant: 'Starbucks', category: 'Food & Drink', icon: 'starbucks', min: 4, max: 15 },
  { merchant: 'Airbnb', category: 'Travel', icon: 'airbnb', min: 110, max: 420 },
  { merchant: 'Nike Store', category: 'Shopping', icon: 'nike', min: 40, max: 170 },
  { merchant: 'Netflix', category: 'Subscription', icon: 'netflix', min: 15.99, max: 15.99 },
  { merchant: 'Walmart', category: 'Grocery', icon: 'walmart', min: 28, max: 135 },
  { merchant: 'AT&T', category: 'Utilities', icon: 'att', min: 55, max: 105 },
  { merchant: 'Spotify', category: 'Subscription', icon: 'spotify', min: 9.99, max: 9.99 },
  { merchant: 'Target', category: 'Shopping', icon: 'target', min: 20, max: 150 },
  { merchant: 'Whole Foods', category: 'Grocery', icon: 'wholefoods', min: 32, max: 140 },
  { merchant: 'Gas Station', category: 'Transport', icon: 'gas', min: 28, max: 65 },
  { merchant: 'Dropbox', category: 'Software', icon: 'dropbox', min: 9.99, max: 9.99 },
];

const HISTORY_START = new Date('2025-02-22T12:00:00');
const HISTORY_END = new Date('2025-10-30T12:00:00');

function generateTransactions(seed: number, payScale: number): Transaction[] {
  const rand = mulberry32(seed);
  const dayMs = 24 * 60 * 60 * 1000;
  const totalDays = Math.round((HISTORY_END.getTime() - HISTORY_START.getTime()) / dayMs);
  const txns: Transaction[] = [];
  let counter = 0;

  for (let d = 0; d <= totalDays; d++) {
    const dateStr = new Date(HISTORY_START.getTime() + d * dayMs).toISOString().slice(0, 10);

    if (d % 14 === 0) {
      const amount = Math.round((2100 + rand() * 1500) * payScale * 100) / 100;
      txns.push({ id: `t${counter++}`, date: dateStr, merchant: 'Direct Deposit', category: 'Payroll', amount, type: 'credit', icon: 'deposit' });
    }

    const hits = rand() < 0.06 ? 2 : rand() < 0.34 ? 1 : 0;
    for (let i = 0; i < hits; i++) {
      const m = MERCHANTS[Math.floor(rand() * MERCHANTS.length)];
      const amount = -Math.round((m.min + rand() * (m.max - m.min)) * payScale * 100) / 100;
      txns.push({ id: `t${counter++}`, date: dateStr, merchant: m.merchant, category: m.category, amount, type: 'debit', icon: m.icon });
    }
  }

  return txns.reverse(); // most recent first
}

const TRANSACTIONS_MAP: Record<string, Transaction[]> = {
  A: generateTransactions(19100221, 1),
  B: generateTransactions(19100222, 1.3),
  C: generateTransactions(19100223, 1.6),
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
