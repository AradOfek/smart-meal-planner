interface SearchBarProps {
  query: string;
  setQuery: (value: string) => void;
}

export default function SearchBar({ query, setQuery }: SearchBarProps) {
  return (
    <div style={{ textAlign: 'center', marginTop: '3rem', marginBottom: '2rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: 'var(--text-h)', fontWeight: 800 }}>
        Find Your Next Meal
      </h1>
      <div style={{ position: 'relative', width: '100%' }}>
        <input 
          type="text"
          placeholder="Search recipes (e.g., Pasta, Chicken)..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '14px 24px',
            fontSize: '16px',
            borderRadius: '24px',
            border: '1px solid var(--border)',
            backgroundColor: 'var(--bg-input)',
            color: 'var(--text-h)',
            outline: 'none',
            boxSizing: 'border-box',
            boxShadow: 'var(--shadow)',
            transition: 'all 0.2s ease'
          }}
        />
      </div>
    </div>
  );
}