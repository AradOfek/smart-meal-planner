import { useEffect } from 'react'; // ◄ Added useEffect import
import type { Recipe, Ingredient } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: Recipe[];
  onRemoveFromCart: (id: number) => void;
  onClearCart: () => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  onRemoveFromCart,
  onClearCart,
}: CheckoutModalProps) {

  // 1. Listen for the ESC key to close the modal (Hook placed ABOVE early return)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    // Cleanup event listener when modal closes/unmounts
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // 2. Early exit AFTER all hooks have executed
  if (!isOpen) return null;

  // 🧠 SAFE REDUCE: Handles potential missing or undefined ingredient values safely
  const combinedIngredients = cart.reduce<{ [key: string]: { quantity: number; unit: string } }>(
    (acc, recipe) => {
      if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) return acc;

      recipe.ingredients.forEach((ing) => {
        // 🛡️ Guard against undefined/null strings or quantities
        const safeName = (ing?.name || 'Unknown Ingredient').trim().toLowerCase();
        const safeUnit = (ing?.unit || 'items').trim().toLowerCase();
        const safeQty = Number(ing?.quantity) || 1;

        const key = `${safeName}_${safeUnit}`;

        if (acc[key]) {
          acc[key].quantity += safeQty;
        } else {
          acc[key] = {
            quantity: safeQty,
            unit: safeUnit,
          };
        }
      });

      return acc;
    },
    {}
  );

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '12px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0 }}>🛒 Your Shopping List</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>✕</button>
        </div>

        {cart.length === 0 ? (
          <p style={{ color: '#888' }}>Your checkout is empty. Add some recipes to generate a grocery list!</p>
        ) : (
          <>
            {/* Selected Recipes List */}
            <div style={{ marginBottom: '1.5rem' }}>
              <strong style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase' }}>Selected Recipes ({cart.length})</strong>
              <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0' }}>
                {cart.map((r) => (
                  <li key={r.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '14px' }}>
                    <span>📖 {r.title}</span>
                    <button 
                      onClick={() => onRemoveFromCart(r.id)} 
                      style={{ background: 'none', border: 'none', color: '#ff4a5a', cursor: 'pointer', fontSize: '12px' }}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '1rem 0' }} />

            {/* Aggregated Grocery Ingredient List */}
            <div>
              <strong style={{ fontSize: '12px', color: '#888', textTransform: 'uppercase' }}>Total Ingredients Needed</strong>
              <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0' }}>
                {Object.entries(combinedIngredients).map(([key, item]) => {
                  const name = key.split('_')[0];
                  return (
                    <li key={key} style={{ padding: '6px 0', borderBottom: '1px solid #1d1551', fontSize: '15px' }}>
                      <strong style={{ color: '#ff4a5a' }}>{item.quantity} {item.unit}</strong> — {name}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
              <button 
                onClick={onClearCart} 
                style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}
              >
                Clear All
              </button>
              <button 
                onClick={() => window.print()} 
                style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', background: '#111', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
              >
                🖨️ Print List
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}