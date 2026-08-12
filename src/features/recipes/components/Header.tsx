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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileNavigate = (view: 'landing' | 'browse' | 'prep') => {
    onNavigate(view);
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = () => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
    handleMobileNavigate(isMobile ? 'browse' : 'landing');
  };

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
        onClick={handleLogoClick}
        style={{ cursor: 'pointer', fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-h)' }}
      >
        🍳 Kitchen Vault
      </div>

      {/* Desktop Navigation Options */}
      <nav className="desktop-nav" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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

        {user && (
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
        )}

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

      {/* Mobile Header Action Controls */}
      <div className="mobile-header-actions" style={{ gap: '8px', alignItems: 'center' }}>
        <button
          onClick={() => handleMobileNavigate('prep')}
          style={{
            backgroundColor: currentView === 'prep' ? 'var(--accent)' : 'var(--accent-light)',
            color: currentView === 'prep' ? '#ffffff' : 'var(--accent)',
            border: '1px solid var(--accent)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-sm)',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          🍽️ Prep ({selectedCount})
        </button>

        <button
          className="mobile-menu-btn"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          style={{
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: '6px',
            color: 'var(--text)',
            fontSize: '20px',
            padding: '4px 10px',
            cursor: 'pointer',
          }}
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <button
            onClick={() => handleMobileNavigate('browse')}
            style={{
              background: 'none',
              border: 'none',
              color: currentView === 'browse' ? 'var(--accent)' : 'var(--text)',
              fontWeight: currentView === 'browse' ? 700 : 500,
              fontSize: '16px',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            📖 Browse Recipes
          </button>

          <button
            onClick={() => handleMobileNavigate('prep')}
            style={{
              background: 'none',
              border: 'none',
              color: currentView === 'prep' ? 'var(--accent)' : 'var(--text)',
              fontWeight: currentView === 'prep' ? 700 : 500,
              fontSize: '16px',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            🍽️ Meal Prep ({selectedCount})
          </button>

          {user && (
            <button
              onClick={() => {
                onOpenAddModal();
                setIsMobileMenuOpen(false);
              }}
              style={{
                backgroundColor: 'var(--accent)',
                color: '#fff',
                border: 'none',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 600,
                fontSize: '15px',
                cursor: 'pointer',
              }}
            >
              + Add Recipe
            </button>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-h)' }}>Theme Mode</span>
            <ThemeToggle />
          </div>

          <div style={{ paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
            {user ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-h)' }}>
                  👤 {profile?.username || user.email?.split('@')[0]}
                </span>
                <button
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  style={{
                    background: 'none',
                    border: '1px solid var(--border)',
                    color: 'var(--text-muted)',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Log Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                style={{
                  backgroundColor: 'var(--accent-light)',
                  color: 'var(--accent)',
                  border: '1px solid var(--accent)',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  width: '100%',
                  cursor: 'pointer',
                }}
              >
                Log In
              </button>
            )}
          </div>
        </div>
      )}

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
}