import type { Recipe } from '../types';

interface PrepSheetProps {
  selectedRecipes: Recipe[];
  onRemoveRecipe: (id: number) => void;
  onClearAll: () => void;
  onBack: () => void;
}

export default function PrepSheet({ selectedRecipes, onRemoveRecipe, onClearAll, onBack }: PrepSheetProps) {
  // Aggregate ingredients from all selected recipes
  const combinedIngredients = selectedRecipes.reduce<{ [key: string]: { quantity: number; unit: string } }>(
    (acc, recipe) => {
      if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) return acc;

      recipe.ingredients.forEach((ing) => {
        const safeName = (ing?.name || 'Unknown Ingredient').trim().toLowerCase();
        const safeUnit = (ing?.unit || 'items').trim().toLowerCase();
        const safeQty = Number(ing?.quantity) || 1;

        const key = `${safeName}_${safeUnit}`;

        if (acc[key]) {
          acc[key].quantity += safeQty;
        } else {
          acc[key] = { quantity: safeQty, unit: safeUnit };
        }
      });

      return acc;
    },
    {}
  );

  return (
    <div>
      {/* Top Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button 
          onClick={onBack}
          style={{ 
            background: 'none', 
            border: '1px solid var(--border)', 
            padding: '8px 16px', 
            borderRadius: '20px', 
            color: 'var(--text)', 
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          ⬅️ Back to Recipes
        </button>

        {selectedRecipes.length > 0 && (
          <button 
            onClick={onClearAll}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: 'var(--accent)', 
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 600
            }}
          >
            Clear Selected Menu
          </button>
        )}
      </div>

      {selectedRecipes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', backgroundColor: 'var(--bg-card)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <span style={{ fontSize: '48px' }}>🍽️</span>
          <h2 style={{ color: 'var(--text-h)', marginTop: '1rem' }}>Your Prep Sheet is Empty</h2>
          <p style={{ color: 'var(--text)', opacity: 0.8 }}>Add some recipes from your vault to generate your menu breakdown and ingredient list.</p>
          <button 
            onClick={onBack}
            style={{ 
              marginTop: '1rem', 
              backgroundColor: 'var(--accent)', 
              color: '#fff', 
              border: 'none', 
              padding: '10px 20px', 
              borderRadius: '6px', 
              cursor: 'pointer',
              fontWeight: 600
            }}
          >
            Explore Recipes
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
          
          {/* 🧾 LEFT COLUMN: Menu "Receipt" Breakdown */}
          <div style={{ 
            backgroundColor: 'var(--bg-card)', 
            padding: '2rem', 
            borderRadius: '12px', 
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)'
          }}>
            <div style={{ borderBottom: '2px dashed var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
              <h2 style={{ margin: 0, color: 'var(--text-h)', fontSize: '20px' }}>🧾 Selected Menu</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', opacity: 0.7 }}>Kitchen Vault Prep Summary</p>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {selectedRecipes.map((r) => (
                <li key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <strong style={{ color: 'var(--text-h)', display: 'block', fontSize: '15px' }}>{r.title}</strong>
                    <span style={{ fontSize: '12px', opacity: 0.7 }}>{r.ingredients?.length || 0} ingredients</span>
                  </div>
                  <button 
                    onClick={() => onRemoveRecipe(r.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '2px dashed var(--border)', display: 'flex', justifyContent: 'space-between' }}>
              <strong>Total Planned Meals:</strong>
              <strong style={{ color: 'var(--accent)' }}>{selectedRecipes.length} Recipes</strong>
            </div>
          </div>

          {/* 🛒 RIGHT COLUMN: Aggregated Pantry & Ingredient List */}
          <div style={{ 
            backgroundColor: 'var(--bg-card)', 
            padding: '2rem', 
            borderRadius: '12px', 
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
              <h2 style={{ margin: 0, color: 'var(--text-h)', fontSize: '20px' }}>🥦 Combined Grocery List</h2>
              <button 
                onClick={() => window.print()} 
                style={{ 
                  backgroundColor: 'var(--text-h)', 
                  color: 'var(--bg-card)', 
                  border: 'none', 
                  padding: '6px 12px', 
                  borderRadius: '6px', 
                  cursor: 'pointer', 
                  fontSize: '12px', 
                  fontWeight: 600 
                }}
              >
                🖨️ Print
              </button>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {Object.entries(combinedIngredients).map(([key, item]) => {
                const name = key.split('_')[0];
                return (
                  <li key={key} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '15px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input type="checkbox" style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                    <span>
                      <strong style={{ color: 'var(--accent)' }}>{item.quantity} {item.unit}</strong> — {name}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

        </div>
      )}
    </div>
  );
}