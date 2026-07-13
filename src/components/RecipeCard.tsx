interface Recipe {
  id: number;
  title: string;
  instructions: string;
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
      <p style={{ color: '#555', fontSize: '14px', lineHeight: '1.5' }}>{recipe.instructions}</p>
    </div>
  );
}