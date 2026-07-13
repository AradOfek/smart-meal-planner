export default function Header() {
  return (
    <header style={{ padding: '1rem 2rem', backgroundColor: '#ffffff', borderBottom: '1px solid #eaeaea', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
      <h2 style={{ margin: 0, color: '#ff4a5a', letterSpacing: '-0.5px' }}>🍳 ReciPlease</h2>
      <nav>
        <a href="#browse" style={{ marginRight: '1.5rem', textDecoration: 'none', color: '#555', fontWeight: 500 }}>Browse</a>
        <a href="#about" style={{ textDecoration: 'none', color: '#555', fontWeight: 500 }}>About Us</a>
      </nav>
    </header>
  );
}