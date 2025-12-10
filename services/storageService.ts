import { Account, Transaction } from '../types';

const STORAGE_KEYS = {
  ACCOUNTS: 'stevest_accounts',
  TRANSACTIONS: 'stevest_transactions',
};

// --- Accounts ---

export const getAccounts = (): Account[] => {
  const data = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
  return data ? JSON.parse(data) : [
    { id: '1', name: 'Main Trading', broker: 'Interactive Brokers', currency: 'USD' },
    { id: '2', name: 'Long Term', broker: 'Vanguard', currency: 'USD' }
  ];
};

export const saveAccount = (account: Account): void => {
  const accounts = getAccounts();
  const existingIndex = accounts.findIndex(a => a.id === account.id);
  if (existingIndex >= 0) {
    accounts[existingIndex] = account;
  } else {
    accounts.push(account);
  }
  localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
};

export const deleteAccount = (id: string): void => {
  const accounts = getAccounts().filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
};

// --- Transactions ---

export const getTransactions = (): Transaction[] => {
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  return data ? JSON.parse(data) : [];
};

export const saveTransaction = (tx: Transaction): void => {
  const txs = getTransactions();
  txs.push(tx);
  // Sort by date descending
  txs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
};

export const deleteTransaction = (id: string): void => {
  const txs = getTransactions().filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(txs));
};

// --- Initial Seed (if empty) ---
export const seedDataIfEmpty = () => {
    if(!localStorage.getItem(STORAGE_KEYS.TRANSACTIONS)) {
        const initialTxs: Transaction[] = [
            { id: 't1', accountId: '1', type: 'DEPOSIT' as any, date: '2023-01-01', amount: 50000, fees: 0, notes: 'Initial Funding' },
            { id: 't2', accountId: '1', type: 'BUY' as any, stockCode: 'AAPL', date: '2023-01-15', quantity: 50, price: 150, amount: 7500, fees: 5 },
            { id: 't3', accountId: '1', type: 'BUY' as any, stockCode: 'TSLA', date: '2023-02-10', quantity: 20, price: 200, amount: 4000, fees: 5 },
            { id: 't4', accountId: '1', type: 'SELL' as any, stockCode: 'TSLA', date: '2023-06-15', quantity: 10, price: 250, amount: 2500, fees: 5 },
        ];
        localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(initialTxs));
    }
}