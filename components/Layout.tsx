import React from 'react';
import { LayoutDashboard, ArrowRightLeft, PieChart, WalletCards } from 'lucide-react';

interface Props {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onOpenTxModal: () => void;
}

const Layout: React.FC<Props> = ({ children, activeTab, onTabChange, onOpenTxModal }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cashflow', label: 'Cashflow', icon: ArrowRightLeft },
    { id: 'dividends', label: 'Dividends', icon: PieChart },
    { id: 'accounts', label: 'Accounts', icon: WalletCards },
  ];

  return (
    <div className="flex min-h-screen bg-crypto-dark text-crypto-text font-sans selection:bg-crypto-accent selection:text-black">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-50 border-r border-white/5 bg-[#0B0E14]/95 backdrop-blur-xl">
        <div className="p-6">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-crypto-accent to-crypto-primary">
                Stevest
            </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                    <button
                        key={item.id}
                        onClick={() => onTabChange(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                            isActive 
                            ? 'bg-gradient-to-r from-crypto-primary/20 to-transparent text-white border-l-4 border-crypto-primary' 
                            : 'text-crypto-muted hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Icon size={20} className={isActive ? 'text-crypto-primary' : 'group-hover:text-white transition-colors'} />
                        <span className="font-medium">{item.label}</span>
                    </button>
                );
            })}
        </nav>

        <div className="p-6">
            <button 
                onClick={onOpenTxModal}
                className="w-full py-3 rounded-xl bg-crypto-accent text-slate-900 font-bold shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] transition-all transform hover:-translate-y-1"
            >
                + Transaction
            </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 inset-x-0 h-16 bg-[#0B0E14]/90 backdrop-blur-md border-b border-white/5 z-40 flex items-center justify-between px-4">
         <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-crypto-accent to-crypto-primary">
            Stevest
        </h1>
        <button onClick={onOpenTxModal} className="px-3 py-1.5 bg-crypto-accent text-slate-900 text-sm font-bold rounded-lg">
            + New
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8 min-h-screen relative overflow-hidden">
         {/* Background Decoration */}
         <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-crypto-primary/5 to-transparent pointer-events-none" />
         
         <div className="relative z-10 max-w-7xl mx-auto">
            {children}
         </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-[#0B0E14]/90 backdrop-blur-xl border-t border-white/5 z-40 flex justify-around p-2 pb-safe">
        {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
                <button
                    key={item.id}
                    onClick={() => onTabChange(item.id)}
                    className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                        isActive ? 'text-crypto-accent' : 'text-crypto-muted'
                    }`}
                >
                    <Icon size={20} />
                    <span className="text-[10px] mt-1 font-medium">{item.label}</span>
                </button>
            );
        })}
      </nav>
    </div>
  );
};

export default Layout;