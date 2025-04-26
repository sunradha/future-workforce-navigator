import React, { useState } from 'react';
import { 
  BarChart, 
  DatabaseBackup, 
  Gauge, 
  LayoutDashboard, 
  TrendingUp,
  UserCog,
  Menu,
  Search,
  DollarSign,
  Network
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardTab } from '@/types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: DashboardTab;
  setActiveTab: (tab: DashboardTab) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigation = [
    { name: 'Risk Mapping', href: '#', icon: Gauge, tab: 'risk' as DashboardTab },
    { name: 'Training Assessment', href: '#', icon: BarChart, tab: 'effectiveness' as DashboardTab },
    { name: 'Predictive Modeling', href: '#', icon: TrendingUp, tab: 'prediction' as DashboardTab },
    { name: 'Budget Analysis', href: '#', icon: DollarSign, tab: 'budget' as DashboardTab },
    { name: 'Role Prioritization', href: '#', icon: UserCog, tab: 'prioritization' as DashboardTab },
    { name: 'AI Analysis', href: '#', icon: Network, tab: 'process-mining' as DashboardTab },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`bg-sidebar text-sidebar-foreground ${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 ease-in-out`}>
        <div className="h-screen flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <div className={`${sidebarOpen ? 'block' : 'hidden'}`}>
              <h1 className="text-xl font-bold">Workforce Navigator</h1>
            </div>
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md hover:bg-sidebar-accent"
            >
              <Menu size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-2 space-y-1">
              {navigation.map((item) => (
                <Button 
                  key={item.name} 
                  variant="ghost"
                  onClick={() => setActiveTab(item.tab)}
                  className={`
                    w-full justify-start mb-1 
                    ${activeTab === item.tab ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent/50'}
                    ${!sidebarOpen && 'justify-center px-2'}
                  `}
                >
                  <item.icon className={`${sidebarOpen ? 'mr-3' : ''}`} size={20} />
                  {sidebarOpen && <span>{item.name}</span>}
                </Button>
              ))}
            </nav>
          </div>

          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center ${sidebarOpen ? 'mr-3' : ''}`}>
                <DatabaseBackup size={18} />
              </div>
              {sidebarOpen && (
                <div>
                  <p className="text-sm font-semibold">Data Last Updated</p>
                  <p className="text-xs text-sidebar-foreground/70">April 23, 2025</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-hidden">
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Future Workforce Navigator</h1>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary w-64"
                />
              </div>
              <Button variant="outline">Help</Button>
            </div>
          </div>
        </div>
        
        <div className="p-6 overflow-auto h-[calc(100vh-73px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
