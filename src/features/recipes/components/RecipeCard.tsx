import type { Recipe } from '../types'; 

interface RecipeCardProps {
  recipe: Recipe;
  onDelete: (id: number) => void;
  onAddToCart: (recipe: Recipe) => void;
}

export default function RecipeCard({ recipe, onDelete, onAddToCart }: RecipeCardProps) {
  return (
    <div style={{
      backgroundColor: 'var(--bg-card)',
      padding: '1.5rem',
      borderRadius: '12px',
      marginBottom: '1rem',
      boxShadow: 'var(--shadow)',
      border: '1px solid var(--border)',
      position: 'relative'
    }}>
      {/* Delete button */}
      <button
        onClick={() => onDelete(recipe.id)}
        style={{
          position: 'absolute',
          top: '1.5rem',
          right: '1.5rem',
          background: 'none',
          border: 'none',
          color: 'var(--accent)',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
        title="Delete Recipe"
      >
        🗑️
      </button>

      {/* Add to Checkout button */}
      <button
        onClick={() => onAddToCart(recipe)}
        style={{
          backgroundColor: 'var(--accent)',
          color: '#ffffff',
          border: 'none',
          padding: '6px 12px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 600,
          marginBottom: '10px'
        }}
      >
        📖 Add to Meal Plan
      </button>

      <h3 style={{ margin: '0 2.5rem 0.5rem 0', color: 'var(--text-h)' }}>{recipe.title}</h3>
      
      {/* Structured Ingredients List Section */}
      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <strong style={{ fontSize: '13px', color: 'var(--text-h)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ingredients</strong>
          <ul style={{ 
            listStyleType: 'none', 
            padding: 0, 
            margin: '0.25rem 0 0 0', 
            fontSize: '14px', 
            color: 'var(--text)' 
          }}>
            {recipe.ingredients.map((ing, idx) => (
              <li key={idx} style={{ padding: '0.2rem 0', borderBottom: '1px solid var(--border)' }}>
                <span style={{ fontWeight: '600', color: 'var(--text-h)' }}>{ing.quantity} {ing.unit}</span> — {ing.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Instructions */}
      <strong style={{ fontSize: '13px', color: 'var(--text-h)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Instructions</strong>
      <p style={{ color: 'var(--text)', fontSize: '14px', lineHeight: '1.5', margin: '0.25rem 0 0 0' }}>{recipe.instructions}</p>
    </div>
  );
}