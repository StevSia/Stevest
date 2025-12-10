import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Transaction, TransactionType, Account } from '../types';
import { saveTransaction } from '../services/storageService';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  accounts: Account[];
}

const TransactionModal: React.FC<Props> = ({ isOpen, onClose, onSave, accounts }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.BUY);
  const [accountId, setAccountId] = useState<string>(accounts[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [stockCode, setStockCode] = useState('');
  const [price, setPrice] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [amount, setAmount] = useState<string>(''); // For deposit/withdraw
  const [fees, setFees] = useState<string>('0');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate total amount for stock transactions
    let finalAmount = 0;
    if (type === TransactionType.BUY || type === TransactionType.SELL) {
      finalAmount = (parseFloat(price) * parseFloat(quantity));
    } else {
      finalAmount = parseFloat(amount);
    }

    const newTx: Transaction = {
      id: crypto.randomUUID(),
      accountId,
      type,
      date,
      fees: parseFloat(fees) || 0,
      notes,
      amount: finalAmount,
      // Optional fields based on type
      ...( (type === TransactionType.BUY || type === TransactionType.SELL) && {
        stockCode: stockCode.toUpperCase(),
        price: parseFloat(price),
        quantity: parseFloat(quantity)
      })
    };

    saveTransaction(newTx);
    onSave();
    onClose();
    
    // Reset form
    setStockCode('');
    setPrice('');
    setQuantity('');
    setAmount('');
    setFees('0');
  };

  const isStockTx = type === TransactionType.BUY || type === TransactionType.SELL;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="glass-panel w-full max-w-md rounded-2xl p-6 relative border-t border-crypto-accent/20 shadow-2xl shadow-crypto-accent/5">
        <button onClick={onClose} className="absolute top-4 right-4 text-crypto-muted hover:text-white transition-colors">
          <X size={20} />
        </button>
        
        <h2 className="text-2xl font-bold text-white mb-6">New Transaction</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/50 rounded-lg border border-slate-700">
            {Object.values(TransactionType).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`text-xs font-bold py-2 rounded-md transition-all ${
                  type === t 
                    ? 'bg-crypto-accent text-slate-900 shadow-lg shadow-crypto-accent/20' 
                    : 'text-crypto-muted hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-crypto-muted mb-1">Account</label>
              <select 
                value={accountId} 
                onChange={e => setAccountId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-crypto-accent focus:outline-none"
              >
                {accounts.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-crypto-muted mb-1">Date</label>
              <input 
                type="date" 
                value={date} 
                onChange={e => setDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-crypto-accent focus:outline-none"
                required 
              />
            </div>
          </div>

          {isStockTx && (
            <>
              <div>
                <label className="block text-xs text-crypto-muted mb-1">Stock Code (e.g. AAPL)</label>
                <input 
                  type="text" 
                  value={stockCode} 
                  onChange={e => setStockCode(e.target.value)}
                  placeholder="Ticker"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white uppercase focus:border-crypto-accent focus:outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-crypto-muted mb-1">Quantity</label>
                  <input 
                    type="number" 
                    value={quantity} 
                    onChange={e => setQuantity(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-crypto-accent focus:outline-none"
                    placeholder="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-crypto-muted mb-1">Price per Share</label>
                  <input 
                    type="number" 
                    value={price} 
                    onChange={e => setPrice(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-crypto-accent focus:outline-none"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
            </>
          )}

          {!isStockTx && (
             <div>
                <label className="block text-xs text-crypto-muted mb-1">Amount ({type === TransactionType.DEPOSIT ? 'In' : 'Out'})</label>
                <input 
                  type="number" 
                  value={amount} 
                  onChange={e => setAmount(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-crypto-accent focus:outline-none"
                  placeholder="0.00"
                  required
                />
             </div>
          )}

          <div>
             <label className="block text-xs text-crypto-muted mb-1">Fees</label>
             <input 
               type="number" 
               value={fees} 
               onChange={e => setFees(e.target.value)}
               className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm text-white focus:border-crypto-accent focus:outline-none"
               placeholder="0.00"
             />
          </div>
          
          <button 
            type="submit" 
            className="w-full mt-4 bg-gradient-to-r from-crypto-primary to-crypto-accent text-white font-bold py-3 rounded-xl hover:opacity-90 transition-opacity shadow-lg shadow-crypto-primary/25"
          >
            Confirm {type}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;
