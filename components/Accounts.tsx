import React, { useState } from 'react';
import { Account } from '../types';
import { Plus, Trash2, CreditCard } from 'lucide-react';
import { saveAccount, deleteAccount } from '../services/storageService';

interface Props {
  accounts: Account[];
  onUpdate: () => void;
}

const Accounts: React.FC<Props> = ({ accounts, onUpdate }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newBroker, setNewBroker] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newBroker) return;
    
    saveAccount({
      id: crypto.randomUUID(),
      name: newName,
      broker: newBroker,
      currency: 'USD'
    });
    setNewName('');
    setNewBroker('');
    setIsAdding(false);
    onUpdate();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure? This will hide the account from the list but keep transactions safe.')) {
      deleteAccount(id);
      onUpdate();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-white">Accounts</h2>
            <p className="text-crypto-muted text-sm">Manage your connected brokerages.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-crypto-accent text-slate-900 px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-crypto-accent/20"
        >
          <Plus size={18} /> Add Account
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="glass-panel p-6 rounded-2xl border border-crypto-accent/30 animate-in fade-in zoom-in-95 duration-200">
           <h3 className="text-lg font-bold text-white mb-4">Link New Account</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                  <label className="block text-xs text-crypto-muted mb-1">Account Name</label>
                  <input 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-crypto-accent focus:outline-none"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    placeholder="e.g., Main Trading"
                    required
                  />
              </div>
              <div>
                  <label className="block text-xs text-crypto-muted mb-1">Broker Name</label>
                  <input 
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:border-crypto-accent focus:outline-none"
                    value={newBroker}
                    onChange={e => setNewBroker(e.target.value)}
                    placeholder="e.g., Robinhood"
                    required
                  />
              </div>
           </div>
           <div className="flex justify-end mt-4 gap-2">
             <button type="button" onClick={() => setIsAdding(false)} className="px-4 py-2 text-sm text-crypto-muted hover:text-white">Cancel</button>
             <button type="submit" className="px-4 py-2 bg-crypto-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-crypto-primary/20">Save Account</button>
           </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(account => (
          <div key={account.id} className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-crypto-accent/30 transition-all group relative">
             <div className="flex items-start justify-between">
                <div className="p-3 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-white/5 shadow-inner">
                    <CreditCard className="text-crypto-accent" size={24} />
                </div>
                <button onClick={() => handleDelete(account.id)} className="text-slate-600 hover:text-crypto-danger transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 size={18} />
                </button>
             </div>
             <div className="mt-4">
                <h3 className="text-xl font-bold text-white">{account.name}</h3>
                <p className="text-sm text-crypto-muted">{account.broker}</p>
             </div>
             <div className="mt-4 flex items-center gap-2">
                <span className="px-2 py-1 text-xs font-mono bg-white/5 rounded text-crypto-muted border border-white/5">
                    {account.currency}
                </span>
                <span className="px-2 py-1 text-xs font-mono bg-crypto-success/10 text-crypto-success rounded border border-crypto-success/10">
                    Active
                </span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Accounts;
