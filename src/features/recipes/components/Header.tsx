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
  onOpenAddModal 
}: HeaderProps) {
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
      {/* Brand Title / Logo */}
      <div 
        onClick={() => onNavigate('landing')}
        style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
      >
        <span style={{ fontSize: '24px' }}>🍳</span>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--text-h)' }}>
          Kitchen Vault
        </h1>
      </div>

      {/* Navigation & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            onClick={() => onNavigate('landing')}
            style={{
              background: 'none',
              border: 'none',
              color: currentView === 'landing' ? 'var(--accent)' : 'var(--text-h)',
              cursor: 'pointer',
              fontWeight: currentView === 'landing' ? 700 : 500,
              fontSize: '14px'
            }}
          >
            Home
          </button>

          <button 
            onClick={() => onNavigate('browse')}
            style={{
              background: 'none',
              border: 'none',
              color: currentView === 'browse' ? 'var(--accent)' : 'var(--text-h)',
              cursor: 'pointer',
              fontWeight: currentView === 'browse' ? 700 : 500,
              fontSize: '14px'
            }}
          >
            Browse
          </button>

          <button 
            onClick={() => onNavigate('prep')}
            style={{
              background: 'none',
              border: 'none',
              color: currentView === 'prep' ? 'var(--accent)' : 'var(--text-h)',
              cursor: 'pointer',
              fontWeight: currentView === 'prep' ? 700 : 500,
              fontSize: '14px'
            }}
          >
            Prep Sheet {selectedCount > 0 && `(${selectedCount})`}
          </button>
        </nav>

        {/* Modal Action Trigger */}
        <button
          onClick={onOpenAddModal}
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
          + Add Recipe
        </button>

        <ThemeToggle />
      </div>
    </header>
  );
}