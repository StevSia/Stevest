import React from 'react';
import { Transaction, TransactionType } from '../types';
import { ArrowDownLeft, ArrowUpRight, Search, Filter } from 'lucide-react';

interface Props {
  transactions: Transaction[];
}

const Cashflow: React.FC<Props> = ({ transactions }) => {
  
  const getIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.DEPOSIT:
      case TransactionType.SELL:
        return <ArrowDownLeft className="text-crypto-success" size={20} />;
      case TransactionType.WITHDRAW:
      case TransactionType.BUY:
        return <ArrowUpRight className="text-crypto-danger" size={20} />;
      default:
        return <div />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h2 className="text-2xl font-bold text-white">Transaction History</h2>
                <p className="text-crypto-muted text-sm">Track your deposits, withdrawals, and trades.</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-2.5 text-crypto-muted" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search transactions..." 
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-crypto-accent focus:outline-none"
                    />
                </div>
                <button className="p-2 bg-slate-900 border border-slate-700 rounded-lg text-crypto-muted hover:text-white hover:border-crypto-accent transition-colors">
                    <Filter size={18} />
                </button>
            </div>
        </div>

        <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-white/5 text-xs text-crypto-muted uppercase">
                    <tr>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Asset</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Quantity</th>
                        <th className="px-6 py-4 text-right">Amount</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                    {transactions.map((tx) => (
                        <tr key={tx.id} className="hover:bg-white/5 transition-colors group">
                        <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-900 border border-slate-700 group-hover:border-crypto-accent/50 transition-colors`}>
                                    {getIcon(tx.type)}
                                </div>
                                <span className="font-medium text-white capitalize">{tx.type.toLowerCase()}</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-white font-bold">
                            {tx.stockCode || 'USD'}
                        </td>
                        <td className="px-6 py-4 text-sm text-crypto-muted">
                            {tx.date}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                            {tx.price ? `$${tx.price.toFixed(2)}` : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-white">
                            {tx.quantity || '-'}
                        </td>
                        <td className="px-6 py-4 text-right font-mono text-sm">
                            <span className={
                                tx.type === TransactionType.DEPOSIT || tx.type === TransactionType.SELL 
                                ? 'text-crypto-success' 
                                : 'text-white'
                            }>
                                {tx.type === TransactionType.DEPOSIT || tx.type === TransactionType.SELL ? '+' : '-'}
                                ${tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                        </td>
                        </tr>
                    ))}
                     {transactions.length === 0 && (
                        <tr>
                            <td colSpan={6} className="px-6 py-12 text-center text-crypto-muted">
                                No transactions recorded yet.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
};

export default Cashflow;
