interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

interface Recipe {
  id: number;
  title: string;
  instructions: string;
  ingredients?: Ingredient[]; // The "?" makes it optional so old recipes without ingredients don't crash the app
}

interface RecipeCardProps {
  recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <div style={{
      backgroundColor: '#ffffff',
      padding: '1.5rem',
      borderRadius: '12px',
      marginBottom: '1rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      border: '1px solid #eaeaea'
    }}>
      <h3 style={{ margin: '0 0 0.5rem 0', color: '#111' }}>{recipe.title}</h3>
      
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