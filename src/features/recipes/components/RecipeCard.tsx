import type { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onDelete: (id: number) => void;
  onSelect: (recipe: Recipe) => void;
}

export default function RecipeCard({ recipe, onDelete, onSelect }: RecipeCardProps) {
  return (
    <div 
      style={{
        backgroundColor: 'var(--bg-card)',
        padding: '1.5rem',
        borderRadius: 'var(--radius)',
        marginBottom: '1.25rem',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '1rem' }}>
        <h3 style={{ margin: 0, color: 'var(--text-h)', fontSize: '1.25rem', fontWeight: 700 }}>
          {recipe.title}
        </h3>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
          <button
            onClick={() => onSelect(recipe)}
            style={{
              backgroundColor: 'var(--accent-light)',
              color: 'var(--accent)',
              border: '1px solid var(--accent)',
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px'
            }}
          >
            📌 Add to Menu
          </button>

          <button
            onClick={() => onDelete(recipe.id)}
            title="Delete recipe"
            style={{
              backgroundColor: 'transparent',
              color: 'var(--text-muted)',
              border: 'none',
              padding: '6px 10px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Ingredients Pills / Box */}
      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <div style={{ 
          backgroundColor: 'var(--bg-input)', 
          padding: '0.85rem 1rem', 
          borderRadius: 'var(--radius-sm)', 
          marginBottom: '1rem' 
        }}>
          <strong style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
            Ingredients
          </strong>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '14px', color: 'var(--text)' }}>
            {recipe.ingredients.map((ing, idx) => (
              <li key={idx} style={{ marginBottom: '2px' }}>
                <strong style={{ color: 'var(--text-h)' }}>{ing.quantity} {ing.unit}</strong> {ing.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Instructions */}
      {recipe.instructions && (
        <p style={{ fontSize: '14px', color: 'var(--text)', lineHeight: 1.6, margin: 0 }}>
          {Array.isArray(recipe.instructions) ? recipe.instructions.join(' ') : recipe.instructions}
        </p>
      )}
    </div>
  );
}