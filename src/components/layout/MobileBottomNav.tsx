import React from 'react';
import { Home, ArrowLeftRight, Plus, BarChart3, Menu } from 'lucide-react';
import { ActiveNavPage } from './Sidebar';

interface MobileBottomNavProps {
  currentPage: ActiveNavPage;
  onSelectPage: (page: ActiveNavPage) => void;
  onOpenQuickAdd: () => void;
  onToggleMobileMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPage,
  onSelectPage,
  onOpenQuickAdd,
  onToggleMobileMenu
}) => {
  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      {/* 1. Home / Dashboard */}
      <button
        type="button"
        className={`bottom-nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
        onClick={() => onSelectPage('dashboard')}
      >
        <Home size={20} />
        <span>Home</span>
      </button>

      {/* 2. Transactions */}
      <button
        type="button"
        className={`bottom-nav-item ${currentPage === 'transactions' ? 'active' : ''}`}
        onClick={() => onSelectPage('transactions')}
      >
        <ArrowLeftRight size={20} />
        <span>Trans</span>
      </button>

      {/* 3. Center Elevated Floating Action Button (+) */}
      <div className="bottom-nav-fab-wrapper">
        <button
          type="button"
          className="bottom-nav-fab"
          onClick={onOpenQuickAdd}
          aria-label="Add Transaction"
          title="Add Expense or Income"
        >
          <Plus size={24} strokeWidth={2.6} />
        </button>
      </div>

      {/* 4. Reports / Analytics */}
      <button
        type="button"
        className={`bottom-nav-item ${currentPage === 'analytics' || currentPage === 'reports' ? 'active' : ''}`}
        onClick={() => onSelectPage('analytics')}
      >
        <BarChart3 size={20} />
        <span>Reports</span>
      </button>

      {/* 5. More / Menu Drawer */}
      <button
        type="button"
        className="bottom-nav-item"
        onClick={onToggleMobileMenu}
        aria-label="Open More Options"
      >
        <Menu size={20} />
        <span>More</span>
      </button>
    </nav>
  );
};

