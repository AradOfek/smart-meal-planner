import { useState } from 'react';
import { useAuth } from '../../../context/useAuth';
import AuthModal from '../auth/AuthModal';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  selectedCount: number;
  currentView: 'landing' | 'browse' | 'prep';
  onNavigate: (view: 'landing' | 'browse' | 'prep') => void;
  onOpenAddModal: () => void;
}

export default function Header({
  selectedCount,
  currentView,
  onNavigate,
  onOpenAddModal,
}: HeaderProps) {
  const { user, profile, signOut } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <header
      style={{
        backgroundColor: 'var(--bg-navbar)',
        borderBottom: '1px solid var(--border)',
        padding: '1rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div
        onClick={() => onNavigate('landing')}
        style={{ cursor: 'pointer', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-h)' }}
      >
        🍳 Kitchen Vault
      </div>

      {/* Navigation Options */}
      <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button
          onClick={() => onNavigate('browse')}
          style={{
            background: 'none',
            border: 'none',
            color: currentView === 'browse' ? 'var(--accent)' : 'var(--text)',
            fontWeight: currentView === 'browse' ? 700 : 500,
            cursor: 'pointer',
          }}
        >
          Browse Recipes
        </button>

        <button
          onClick={() => onNavigate('prep')}
          style={{
            background: 'none',
            border: 'none',
            color: currentView === 'prep' ? 'var(--accent)' : 'var(--text)',
            fontWeight: currentView === 'prep' ? 700 : 500,
            cursor: 'pointer',
          }}
        >
          Meal Prep ({selectedCount})
        </button>

        <button
          onClick={onOpenAddModal}
          style={{
            backgroundColor: 'var(--accent)',
            color: '#fff',
            border: 'none',
            padding: '8px 14px',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          + Add Recipe
        </button>

        {/* Theme Toggle Button */}
        <ThemeToggle />

        {/* Auth Section */}
        <div style={{ marginLeft: '0.5rem', paddingLeft: '1rem', borderLeft: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '10px' }}>
          {user ? (
            <>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-h)' }}>
                👤 {profile?.username || user.email?.split('@')[0]}
              </span>
              <button
                onClick={signOut}
                style={{
                  background: 'none',
                  border: '1px solid var(--border)',
                  color: 'var(--text-muted)',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Log Out
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              style={{
                backgroundColor: 'var(--accent-light)',
                color: 'var(--accent)',
                border: '1px solid var(--accent)',
                padding: '6px 14px',
                borderRadius: '6px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Log In
            </button>
          )}
        </div>
      </nav>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
}