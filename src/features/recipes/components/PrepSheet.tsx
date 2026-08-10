import { useState } from 'react';
import type { SelectedRecipe, Recipe } from '../types';

interface PrepSheetProps {
  selectedRecipes: SelectedRecipe[];
  onAddRecipe: (recipe: Recipe) => void;
  onRemoveRecipe: (selectionId: string) => void;
  onRemoveAllOfRecipe: (recipeId: number, source: 'recipes' | 'user_recipes') => void;
  onClearAll: () => void;
  onBack: () => void;
}

export default function PrepSheet({
  selectedRecipes,
  onAddRecipe,
  onRemoveRecipe,
  onRemoveAllOfRecipe,
  onClearAll,
  onBack,
}: PrepSheetProps) {
  const [copied, setCopied] = useState(false);

  // Group selected recipes by recipe ID & source
  const groupedRecipesMap = selectedRecipes.reduce<{
    [key: string]: {
      recipe: Recipe;
      count: number;
      sampleSelectionId: string;
    };
  }>((acc, item) => {
    const groupKey = `${item.recipe.source}_${item.recipe.id}`;
    if (acc[groupKey]) {
      acc[groupKey].count += 1;
    } else {
      acc[groupKey] = {
        recipe: item.recipe,
        count: 1,
        sampleSelectionId: item.selectionId,
      };
    }
    return acc;
  }, {});

  const groupedRecipes = Object.values(groupedRecipesMap);

  // Aggregate ingredients from all selected recipes
  const combinedIngredients = selectedRecipes.reduce<{ [key: string]: { quantity: number; unit: string } }>(
    (acc, item) => {
      const recipe = item.recipe;
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

  // Format shopping list text for WhatsApp & Web Share API
  const generateFormattedText = () => {
    let text = `🛒 *Kitchen Vault Shopping List*\n\n`;

    text += `*Planned Meals:* (${selectedRecipes.length} total)\n`;
    groupedRecipes.forEach(({ recipe, count }) => {
      text += `• ${count}x ${recipe.title}\n`;
    });

    text += `\n*Ingredients Needed:*\n`;
    Object.entries(combinedIngredients).forEach(([key, item]) => {
      const name = key.split('_')[0];
      text += `[ ] ${item.quantity} ${item.unit} — ${name}\n`;
    });

    text += `\n_Generated with Kitchen Vault_`;
    return text;
  };

  const handleWhatsAppShare = () => {
    const formattedText = generateFormattedText();
    const url = `https://wa.me/?text=${encodeURIComponent(formattedText)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    const formattedText = generateFormattedText();

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Kitchen Vault Shopping List',
          text: formattedText,
        });
        return;
      } catch (err: unknown) {
        // Fallback to clipboard if share was cancelled or failed
        if (err instanceof Error && err.name === 'AbortError') return;
      }
    }

    // Fallback: Copy to Clipboard
    try {
      await navigator.clipboard.writeText(formattedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Could not copy to clipboard');
    }
  };

  return (
    <div>
      {/* Top Controls */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
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
            className="no-print"
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
          
          {/* 🧾 LEFT COLUMN: Menu "Receipt" Breakdown with Quantity Adjusters */}
          <div className="printable-card" style={{ 
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
              {groupedRecipes.map(({ recipe, count, sampleSelectionId }) => (
                <li key={`${recipe.source}_${recipe.id}`} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <strong style={{ color: 'var(--text-h)', display: 'block', fontSize: '15px' }}>{recipe.title}</strong>
                    <span style={{ fontSize: '12px', opacity: 0.7 }}>{recipe.ingredients?.length || 0} ingredients</span>
                  </div>

                  {/* Quantity Controls & Remove */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="no-print" style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '6px', overflow: 'hidden' }}>
                      <button
                        onClick={() => onRemoveRecipe(sampleSelectionId)}
                        style={{
                          backgroundColor: 'var(--bg-input)',
                          color: 'var(--text)',
                          border: 'none',
                          width: '28px',
                          height: '28px',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '14px'
                        }}
                        title="Decrease Quantity"
                      >
                        -
                      </button>

                      <span style={{ padding: '0 10px', fontSize: '14px', fontWeight: 700, color: 'var(--text-h)' }}>
                        {count}
                      </span>

                      <button
                        onClick={() => onAddRecipe(recipe)}
                        style={{
                          backgroundColor: 'var(--bg-input)',
                          color: 'var(--text)',
                          border: 'none',
                          width: '28px',
                          height: '28px',
                          cursor: 'pointer',
                          fontWeight: 700,
                          fontSize: '14px'
                        }}
                        title="Increase Quantity"
                      >
                        +
                      </button>
                    </div>

                    <button 
                      onClick={() => onRemoveAllOfRecipe(recipe.id, recipe.source)}
                      className="no-print"
                      style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '12px', fontWeight: 600, marginLeft: '4px' }}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '2px dashed var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>Total Planned Meals:</strong>
              <strong style={{ color: 'var(--accent)' }}>{selectedRecipes.length} Items ({groupedRecipes.length} Recipes)</strong>
            </div>

            {/* Bottom Primary Export Action Button */}
            <div className="no-print" style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={handleWhatsAppShare}
                style={{
                  backgroundColor: '#25D366',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                💬 Send via WhatsApp
              </button>

              <button
                onClick={handleNativeShare}
                style={{
                  backgroundColor: 'var(--accent)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                📱 {copied ? 'Copied to Clipboard! ✓' : 'Share List / Copy'}
              </button>
            </div>
          </div>

          {/* 🛒 RIGHT COLUMN: Aggregated Pantry & Ingredient List */}
          <div className="printable-card" style={{ 
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
                className="no-print"
                style={{ 
                  backgroundColor: 'var(--text-h)', 
                  color: 'var(--bg-card)', 
                  border: 'none', 
                  padding: '8px 14px', 
                  borderRadius: '6px', 
                  cursor: 'pointer', 
                  fontSize: '13px', 
                  fontWeight: 600 
                }}
              >
                🖨️ Print List
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