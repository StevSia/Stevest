import React, { useState, useEffect } from 'react';
import { Transaction, DividendInfo, TransactionType } from '../types';
import { getDividendInsights } from '../services/geminiService';
import { Sparkles, Calendar, DollarSign, RefreshCw, AlertCircle } from 'lucide-react';

interface Props {
  transactions: Transaction[];
}

const Dividends: React.FC<Props> = ({ transactions }) => {
  const [data, setData] = useState<DividendInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Extract unique stock symbols from transactions
  const symbols: string[] = Array.from(new Set(
    transactions
      .filter(t => t.stockCode && (t.type === TransactionType.BUY))
      .map(t => t.stockCode as string)
  ));

  const fetchInsights = async () => {
    if (symbols.length === 0) return;
    setLoading(true);
    setError('');
    try {
      const insights = await getDividendInsights(symbols);
      setData(insights);
    } catch (err) {
      setError('Failed to fetch AI insights. Please check API key configuration.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions.length]); // Re-fetch if new transactions are added

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-bold text-white flex items-center gap-2">
             <Sparkles className="text-crypto-primary" /> Dividend Intelligence
           </h2>
           <p className="text-crypto-muted text-sm mt-1">
             AI-powered analysis of upcoming dividends for your portfolio assets.
           </p>
        </div>
        <button 
          onClick={fetchInsights}
          disabled={loading || symbols.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700 disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          <span>Refresh AI</span>
        </button>
      </div>

      {!process.env.API_KEY && (
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-200 flex items-center gap-3">
              <AlertCircle size={20} />
              <span>API Key not found. Please add your Gemini API Key to env to enable AI features.</span>
          </div>
      )}

      {symbols.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center">
            <p className="text-crypto-muted">No stocks found in your portfolio to analyze.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
                 // Loading Skeletons
                 Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="glass-panel p-6 rounded-2xl animate-pulse">
                        <div className="h-6 w-1/3 bg-slate-700 rounded mb-4"></div>
                        <div className="h-4 w-1/2 bg-slate-800 rounded mb-2"></div>
                        <div className="h-4 w-2/3 bg-slate-800 rounded"></div>
                    </div>
                 ))
            ) : data.length > 0 ? (
                data.map((item, idx) => (
                    <div key={idx} className="glass-panel p-6 rounded-2xl border-l-4 border-crypto-primary relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <DollarSign size={80} />
                        </div>
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white">{item.symbol}</h3>
                                <p className="text-sm text-crypto-muted">{item.companyName}</p>
                            </div>
                            <div className="px-3 py-1 bg-crypto-primary/20 text-crypto-primary text-xs font-bold rounded-full border border-crypto-primary/20">
                                {item.yield} Yield
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-crypto-muted flex items-center gap-1">
                                    <Calendar size={14} /> Ex-Date
                                </span>
                                <span className="text-white font-medium">{item.exDate}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-crypto-muted flex items-center gap-1">
                                    <DollarSign size={14} /> Pay Date
                                </span>
                                <span className="text-white font-medium">{item.payDate}</span>
                            </div>
                            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                                <span className="text-crypto-muted text-xs uppercase tracking-wider">Amount / Share</span>
                                <span className="text-lg font-bold text-crypto-success">{item.amountPerShare}</span>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-span-full glass-panel p-8 text-center text-crypto-muted">
                    No dividend data available or AI request failed.
                </div>
            )}
        </div>
      )}
    </div>
  );
};

export default Dividends;