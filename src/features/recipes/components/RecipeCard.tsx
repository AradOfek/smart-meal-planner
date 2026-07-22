import type { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onDelete: (id: number) => void;
  onSelect: (recipe: Recipe) => void; // 👈 Added onSelect
}

export default function RecipeCard({ recipe, onDelete, onSelect }: RecipeCardProps) {
  return (
    <div 
      style={{
        backgroundColor: 'var(--bg-card)',
        color: 'var(--text)',
        padding: '1.25rem',
        borderRadius: '12px',
        marginBottom: '1rem',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <h3 style={{ margin: 0, color: 'var(--text-h)', fontSize: '18px' }}>{recipe.title}</h3>
        
        <div style={{ display: 'flex', gap: '8px' }}>
          {/* 📌 Add to Menu Button */}
          <button
            onClick={() => onSelect(recipe)} // 👈 Triggers onSelect from hook
            style={{
              backgroundColor: 'var(--text-h)',
              color: 'var(--bg-card)',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px'
            }}
          >
            📌 Add to Menu
          </button>

          {/* 🗑️ Delete Button */}
          <button
            onClick={() => onDelete(recipe.id)}
            style={{
              backgroundColor: 'transparent',
              color: 'var(--accent)',
              border: '1px solid var(--border)',
              padding: '6px 10px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            ✕
          </button>
        </div>
      </div>

      {/* Ingredients Preview */}
      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <div style={{ marginBottom: '0.75rem' }}>
          <strong style={{ fontSize: '12px', color: 'var(--text)', opacity: 0.7, textTransform: 'uppercase' }}>
            Ingredients:
          </strong>
          <ul style={{ margin: '4px 0 0 0', paddingLeft: '1.2rem', fontSize: '14px' }}>
            {recipe.ingredients.map((ing, idx) => (
              <li key={idx}>
                {ing.quantity} {ing.unit} {ing.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Instructions */}
      {recipe.instructions && (
        <p style={{ fontSize: '14px', opacity: 0.9, lineHeight: 1.4, margin: 0 }}>
          {Array.isArray(recipe.instructions) ? recipe.instructions.join(' ') : recipe.instructions}
        </p>
      )}
    </div>
  );
}