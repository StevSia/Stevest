import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Cashflow from './components/Cashflow';
import Dividends from './components/Dividends';
import Accounts from './components/Accounts';
import TransactionModal from './components/TransactionModal';
import { getAccounts, getTransactions, seedDataIfEmpty } from './services/storageService';
import { Account, Transaction } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Initial Load
  useEffect(() => {
    seedDataIfEmpty();
    refreshData();
  }, []);

  const refreshData = () => {
    setAccounts(getAccounts());
    setTransactions(getTransactions());
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard accounts={accounts} transactions={transactions} />;
      case 'cashflow':
        return <Cashflow transactions={transactions} />;
      case 'dividends':
        return <Dividends transactions={transactions} />;
      case 'accounts':
        return <Accounts accounts={accounts} onUpdate={refreshData} />;
      default:
        return <Dashboard accounts={accounts} transactions={transactions} />;
    }
  };

  return (
    <>
      <Layout 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        onOpenTxModal={() => setIsTxModalOpen(true)}
      >
        {renderContent()}
      </Layout>

      <TransactionModal 
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        onSave={refreshData}
        accounts={accounts}
      />
    </>
  );
};

export default App;
