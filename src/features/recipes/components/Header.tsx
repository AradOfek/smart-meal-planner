import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  selectedCount: number;
  currentView: 'browse' | 'prep';
  onNavigate: (view: 'browse' | 'prep') => void;
}

export default function Header({ selectedCount, currentView, onNavigate }: HeaderProps) {
  return (
    <header 
      style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: '1rem 2rem', 
        borderBottom: '1px solid var(--border)', 
        backgroundColor: 'var(--bg-card)', 
        color: 'var(--text-h)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}
    >
      {/* Left Side: Brand Logo */}
      <div 
        onClick={() => onNavigate('browse')}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
      >
        <span style={{ fontSize: '24px' }}>🍳</span>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--text-h)' }}>
          Kitchen Vault
        </h1>
      </div>

      {/* Right Side: Theme Switch + Action Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <ThemeToggle />

        {currentView === 'browse' ? (
          <button 
            onClick={() => onNavigate('prep')}
            style={{
              backgroundColor: 'var(--accent)',
              color: '#ffffff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '20px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            📋 Prep Sheet ({selectedCount})
          </button>
        ) : (
          <button 
            onClick={() => onNavigate('browse')}
            style={{
              backgroundColor: 'transparent',
              color: 'var(--text-h)',
              border: '1px solid var(--border)',
              padding: '8px 16px',
              borderRadius: '20px',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            📖 Browse Recipes
          </button>
        )}
      </div>
    </header>
  );
}