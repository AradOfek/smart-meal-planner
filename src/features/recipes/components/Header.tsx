export default function Header() {
  return (
    <header style={{ 
      padding: '1rem 2rem', 
      backgroundColor: 'var(--bg-card)', 
      borderBottom: '1px solid var(--border)', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      boxShadow: 'var(--shadow)' 
    }}>
      <h2 style={{ margin: 0, color: 'var(--accent)', letterSpacing: '-0.5px' }}>🍳 ReciPlease</h2>
      <nav>
        <a href="#browse" style={{ marginRight: '1.5rem', textDecoration: 'none', color: 'var(--text)', fontWeight: 500 }}>Browse</a>
        <a href="#about" style={{ textDecoration: 'none', color: 'var(--text)', fontWeight: 500 }}>About Us</a>
      </nav>
    </header>
  );
}