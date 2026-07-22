interface HeaderProps {
  selectedCount: number;
  currentView: 'browse' | 'prep';
  onNavigate: (view: 'browse' | 'prep') => void;
}

export default function Header({ selectedCount, currentView, onNavigate }: HeaderProps) {
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1.5rem 2rem',
      borderBottom: '1px solid var(--border)',
      backgroundColor: 'var(--bg-card)'
    }}>
      {/* Click logo to go back to browse view */}
      <h1 
        onClick={() => onNavigate('browse')} 
        style={{ margin: 0, fontSize: '24px', cursor: 'pointer', color: 'var(--text-h)' }}
      >
        🍳 Kitchen Vault
      </h1>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <button
          onClick={() => onNavigate('browse')}
          style={{
            background: 'none',
            border: 'none',
            color: currentView === 'browse' ? 'var(--accent)' : 'var(--text)',
            fontWeight: currentView === 'browse' ? 'bold' : 'normal',
            cursor: 'pointer',
            fontSize: '15px'
          }}
        >
          Browse Recipes
        </button>

        <button
          onClick={() => onNavigate('prep')}
          style={{
            backgroundColor: currentView === 'prep' ? 'var(--accent)' : 'var(--code-bg)',
            color: currentView === 'prep' ? '#fff' : 'var(--text-h)',
            border: '1px solid var(--border)',
            padding: '8px 16px',
            borderRadius: '20px',
            fontWeight: 600,
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          📋 Prep Sheet {selectedCount > 0 && `(${selectedCount})`}
        </button>
      </div>
    </header>
  );
}