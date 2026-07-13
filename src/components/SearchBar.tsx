interface SearchBarProps {
  query: string;
  setQuery: (value: string) => void; // A TypeScript type definition for a function
}

export default function SearchBar({ query, setQuery }: SearchBarProps) {
  return (
    <div style={{ textAlign: 'center', marginTop: '3rem', marginBottom: '2rem' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '1.5rem', color: '#111', fontWeight: 800 }}>Find Your Next Meal</h1>
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
            border: '1px solid #e0e0e0',
            outline: 'none',
            boxSizing: 'border-box',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            transition: 'all 0.2s ease'
          }}
        />
      </div>
    </div>
  );
}