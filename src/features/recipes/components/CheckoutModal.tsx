import { useEffect } from 'react';
import type { SelectedRecipe } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: SelectedRecipe[];
  onRemoveFromCart: (selectionId: string) => void;
  onClearCart: () => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  onRemoveFromCart,
  onClearCart,
}: CheckoutModalProps) {

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const combinedIngredients = cart.reduce<{ [key: string]: { quantity: number; unit: string } }>(
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
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'var(--bg-card)',
        color: 'var(--text)',
        padding: '2rem',
        borderRadius: '12px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflowY: 'auto',
        boxShadow: 'var(--shadow)',
        border: '1px solid var(--border)'
      }}>
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, color: 'var(--text-h)' }}></h2>
          {/* Visible Circular Close Button */}
          <button 
            onClick={onClose} 
            style={{ 
              backgroundColor: 'var(--bg-card-hover)', 
              color: 'var(--text-h)', 
              border: 'none', 
              fontSize: '16px', 
              fontWeight: 'bold',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Close Modal"
          >
            ✕
          </button>
        </div>

        {cart.length === 0 ? (
          <p style={{ color: 'var(--text)' }}>Your mealplan is empty. Add some recipes to generate a grocery list!</p>
        ) : (
          <>
            {/* Selected Recipes List */}
            <div style={{ marginBottom: '1.5rem' }}>
              <strong style={{ fontSize: '12px', color: 'var(--text-h)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Selected Recipes ({cart.length})</strong>
              <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0' }}>
                {cart.map((item) => (
                  <li key={item.selectionId} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '14px', color: 'var(--text)' }}>
                    <span>📖 {item.recipe.title}</span>
                    <button 
                      onClick={() => onRemoveFromCart(item.selectionId)} 
                      style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1rem 0' }} />

            {/* Aggregated Grocery Ingredient List */}
            <div>
              <strong style={{ fontSize: '12px', color: 'var(--text-h)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Ingredients Needed</strong>
              <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0' }}>
                {Object.entries(combinedIngredients).map(([key, item]) => {
                  const name = key.split('_')[0];
                  return (
                    <li key={key} style={{ padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: '15px', color: 'var(--text)' }}>
                      <strong style={{ color: 'var(--accent)' }}>{item.quantity} {item.unit}</strong> — {name}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '1.5rem' }}>
              <button 
                onClick={onClearCart} 
                style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text)', cursor: 'pointer', fontWeight: 500 }}
              >
                Clear All
              </button>
              <button 
                onClick={() => window.print()} 
                style={{ flex: 1, padding: '10px', borderRadius: '6px', border: 'none', background: 'var(--text-h)', color: 'var(--bg-card)', fontWeight: 600, cursor: 'pointer' }}
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