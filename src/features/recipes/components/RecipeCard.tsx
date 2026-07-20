import type {Recipe} from '../types'; 

interface RecipeCardProps {
  recipe: Recipe;
  onDelete: (id: number) => void;
  onAddToCart: (recipe:Recipe) => void;
}

export default function RecipeCard({ recipe, onDelete, onAddToCart }: RecipeCardProps) {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      padding: '1.5rem',
      borderRadius: '12px',
      marginBottom: '1rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      border: '1px solid #eaeaea',
      position: 'relative' // ◄ Crucial for positioning our delete button
    }}>
      {/* 2. Add the delete button in the top right corner */}
      <button
        onClick={() => onDelete(recipe.id)}
        style={{
          position: 'absolute',
          top: '1.5rem',
          right: '1.5rem',
          background: 'none',
          border: 'none',
          color: '#ff4a5a',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 'bold'
        }}
        title="Delete Recipe"
      >
        🗑️
      </button>

      <button
        onClick={() => onAddToCart(recipe)}
        style={{
          backgroundColor: '#ff4a5a',
          color: '#fff',
          border: 'none',
          padding: '6px 12px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 600,
          marginBottom: '10px'
        }}
      >
        🛒 Add to Checkout
      </button>

      <h3 style={{ margin: '0 2.5rem 0.5rem 0', color: '#111' }}>{recipe.title}</h3>
      
      {/* --- Structured Ingredients List Section --- */}
      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <strong style={{ fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ingredients</strong>
          <ul style={{ 
            listStyleType: 'none', 
            padding: 0, 
            margin: '0.25rem 0 0 0', 
            fontSize: '14px', 
            color: '#333' 
          }}>
            {recipe.ingredients.map((ing, idx) => (
              <li key={idx} style={{ padding: '0.2rem 0', borderBottom: '1px solid #f9f9f9' }}>
                <span style={{ fontWeight: '600', color: '#111' }}>{ing.quantity} {ing.unit}</span> — {ing.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Instructions */}
      <strong style={{ fontSize: '13px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Instructions</strong>
      <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.5', margin: '0.25rem 0 0 0' }}>{recipe.instructions}</p>
    </div>
  );
}