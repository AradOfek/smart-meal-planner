import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('kv-theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('kv-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Toggle theme"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
        color: 'var(--text-muted)'
      }}
    >
      <span style={{ fontSize: '14px', lineHeight: 1 }}>☀️</span>
      
      {/* 🎛️ The Pill Switch Track with Flex Alignment for perfect centering */}
      <div
        style={{
          width: '44px',
          height: '24px',
          backgroundColor: isDark ? 'var(--accent)' : 'var(--border)',
          borderRadius: '12px',
          padding: '2px',
          display: 'flex',
          alignItems: 'center', // 🎯 Vertically centers the knob inside track
          justifyContent: isDark ? 'flex-end' : 'flex-start', // 🎯 Slides knob side to side
          transition: 'background-color 0.25s ease',
          boxSizing: 'border-box'
        }}
      >
        {/* ⚪ Perfectly Centered Knob */}
        <div
          style={{
            width: '20px',
            height: '20px',
            backgroundColor: '#FFFFFF',
            borderRadius: '50%',
            transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
          }}
        />
      </div>

      <span style={{ fontSize: '14px', lineHeight: 1 }}>🌙</span>
    </button>
  );
}