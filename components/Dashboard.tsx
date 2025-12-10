import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis } from 'recharts';
import { Account, Transaction, TransactionType, StockHolding } from '../types';
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, DollarSign, Layers } from 'lucide-react';

interface Props {
  accounts: Account[];
  transactions: Transaction[];
}

const COLORS = ['#00F0FF', '#7000FF', '#00FFA3', '#FF3366', '#FACC15', '#94A3B8'];

const Dashboard: React.FC<Props> = ({ accounts, transactions }) => {

  const portfolio = useMemo(() => {
    let cash = 0;
    const holdingsMap = new Map<string, { qty: number, costBasis: number, realizedPL: number }>();

    // Process transactions to build portfolio state
    // Sort transactions ascending by date for accurate processing
    const sortedTx = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sortedTx.forEach(tx => {
      // Cash impact (fees always reduce cash)
      if (tx.type === TransactionType.DEPOSIT) cash += tx.amount;
      if (tx.type === TransactionType.WITHDRAW) cash -= tx.amount;
      if (tx.type === TransactionType.BUY) cash -= tx.amount;
      if (tx.type === TransactionType.SELL) cash += tx.amount;
      
      cash -= tx.fees;

      // Stock impact
      if (tx.stockCode && (tx.type === TransactionType.BUY || tx.type === TransactionType.SELL)) {
        if (!holdingsMap.has(tx.stockCode)) {
          holdingsMap.set(tx.stockCode, { qty: 0, costBasis: 0, realizedPL: 0 });
        }
        
        const data = holdingsMap.get(tx.stockCode)!;
        
        if (tx.type === TransactionType.BUY) {
          // Update weighted average cost
          const currentTotalCost = data.qty * data.costBasis;
          const newTotalCost = currentTotalCost + tx.amount; // amount is price * qty
          const newQty = data.qty + (tx.quantity || 0);
          data.costBasis = newQty > 0 ? newTotalCost / newQty : 0;
          data.qty = newQty;
        } else if (tx.type === TransactionType.SELL) {
          const sellQty = tx.quantity || 0;
          // Calculate Realized P/L: (Sell Price - Avg Cost) * Qty
          const profit = ( (tx.price || 0) - data.costBasis ) * sellQty;
          data.realizedPL += profit;
          data.qty -= sellQty;
        }
      }
    });

    // Finalize Holdings
    const holdings: StockHolding[] = [];
    let totalRealizedPL = 0;
    let totalUnrealizedPL = 0;
    let holdingsValue = 0;

    holdingsMap.forEach((data, symbol) => {
      // MOCK CURRENT PRICE: +/- 10% of cost basis for demo purposes if no live API
      // In a real app, we would fetch this. 
      // Using a deterministic "random" based on symbol char code to stay consistent on re-renders
      const randomFactor = 1 + ((symbol.charCodeAt(0) % 20) - 10) / 100; 
      const currentPrice = data.costBasis * randomFactor; 

      const value = data.qty * currentPrice;
      const unrealized = (currentPrice - data.costBasis) * data.qty;

      totalRealizedPL += data.realizedPL;
      if (data.qty > 0) {
        totalUnrealizedPL += unrealized;
        holdingsValue += value;
        holdings.push({
          symbol,
          quantity: data.qty,
          averageCost: data.costBasis,
          currentPrice: currentPrice,
          totalValue: value,
          unrealizedPL: unrealized,
          unrealizedPLPercent: (unrealized / (data.qty * data.costBasis)) * 100,
          realizedPL: data.realizedPL
        });
      }
    });

    return {
      cashBalance: cash,
      holdings,
      holdingsValue,
      totalRealizedPL,
      totalUnrealizedPL,
      totalEquity: cash + holdingsValue
    };
  }, [transactions]);

  // Chart Data Preparation
  const allocationData = portfolio.holdings.map(h => ({ name: h.symbol, value: h.totalValue }));
  if (portfolio.cashBalance > 0) {
    allocationData.push({ name: 'Cash', value: portfolio.cashBalance });
  }

  // Mock Performance Data for Chart (Just creating a visual curve)
  const performanceData = [
    { name: 'Jan', val: portfolio.totalEquity * 0.9 },
    { name: 'Feb', val: portfolio.totalEquity * 0.95 },
    { name: 'Mar', val: portfolio.totalEquity * 0.92 },
    { name: 'Apr', val: portfolio.totalEquity * 1.05 },
    { name: 'May', val: portfolio.totalEquity * 1.02 },
    { name: 'Jun', val: portfolio.totalEquity },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Equity */}
        <div className="glass-panel p-6 rounded-2xl border-t border-crypto-accent/30 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet size={64} />
          </div>
          <p className="text-crypto-muted text-sm font-medium mb-1">Total Net Worth</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">
            ${portfolio.totalEquity.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <div className="flex items-center mt-2 text-sm text-crypto-success">
            <ArrowUpRight size={16} className="mr-1" />
            <span>+2.4% today</span>
          </div>
        </div>

        {/* Cash Balance */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign size={64} />
          </div>
          <p className="text-crypto-muted text-sm font-medium mb-1">Cash Balance</p>
          <h3 className="text-3xl font-bold text-white tracking-tight">
            ${portfolio.cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <p className="text-xs text-crypto-muted mt-2">Available to trade</p>
        </div>

        {/* Unrealized P/L */}
        <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={64} />
          </div>
          <p className="text-crypto-muted text-sm font-medium mb-1">Unrealized P/L</p>
          <h3 className={`text-3xl font-bold tracking-tight ${portfolio.totalUnrealizedPL >= 0 ? 'text-crypto-success' : 'text-crypto-danger'}`}>
             {portfolio.totalUnrealizedPL >= 0 ? '+' : ''}${portfolio.totalUnrealizedPL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <p className="text-xs text-crypto-muted mt-2">Open Positions</p>
        </div>

         {/* Realized P/L */}
         <div className="glass-panel p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Layers size={64} />
          </div>
          <p className="text-crypto-muted text-sm font-medium mb-1">Realized P/L</p>
          <h3 className={`text-3xl font-bold tracking-tight ${portfolio.totalRealizedPL >= 0 ? 'text-crypto-success' : 'text-crypto-danger'}`}>
             {portfolio.totalRealizedPL >= 0 ? '+' : ''}${portfolio.totalRealizedPL.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
          <p className="text-xs text-crypto-muted mt-2">Closed Positions</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl">
          <h4 className="text-lg font-bold text-white mb-6">Portfolio Performance</h4>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7000FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#7000FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#151A23', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#00F0FF' }}
                />
                <Area type="monotone" dataKey="val" stroke="#7000FF" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Allocation */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center">
          <h4 className="text-lg font-bold text-white mb-2 self-start w-full">Allocation</h4>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {allocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0)" />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ backgroundColor: '#151A23', borderColor: '#334155', borderRadius: '8px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                    <span className="text-xs text-crypto-muted">Assets</span>
                    <p className="text-xl font-bold text-white">{allocationData.length}</p>
                </div>
            </div>
          </div>
          <div className="w-full mt-4 space-y-2">
              {allocationData.slice(0, 4).map((entry, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                          <span className="text-crypto-muted">{entry.name}</span>
                      </div>
                      <span className="text-white font-medium">{((entry.value / portfolio.totalEquity) * 100).toFixed(1)}%</span>
                  </div>
              ))}
          </div>
        </div>
      </div>

      {/* Holdings List */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h4 className="text-lg font-bold text-white">Assets</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-xs text-crypto-muted uppercase">
              <tr>
                <th className="px-6 py-4">Asset</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Balance</th>
                <th className="px-6 py-4">Avg. Cost</th>
                <th className="px-6 py-4 text-right">P/L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {portfolio.holdings.map((h) => (
                <tr key={h.symbol} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold text-crypto-accent border border-crypto-accent/20 mr-3">
                            {h.symbol[0]}
                        </div>
                        <div>
                            <div className="font-bold text-white">{h.symbol}</div>
                            <div className="text-xs text-crypto-muted">{h.quantity} Share(s)</div>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-white">
                    ${h.currentPrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-white">
                    ${h.totalValue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-crypto-muted">
                    ${h.averageCost.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className={`text-sm font-bold ${h.unrealizedPL >= 0 ? 'text-crypto-success' : 'text-crypto-danger'}`}>
                      {h.unrealizedPL >= 0 ? '+' : ''}{h.unrealizedPLPercent.toFixed(2)}%
                    </div>
                    <div className={`text-xs ${h.unrealizedPL >= 0 ? 'text-crypto-success' : 'text-crypto-danger'} opacity-80`}>
                      {h.unrealizedPL >= 0 ? '+' : ''}${h.unrealizedPL.toFixed(2)}
                    </div>
                  </td>
                </tr>
              ))}
              {portfolio.holdings.length === 0 && (
                <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-crypto-muted">
                        No assets found. Start by adding a transaction.
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

export default Dashboard;
