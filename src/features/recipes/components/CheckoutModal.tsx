import { useEffect, useState } from 'react';
import type { SelectedRecipe, Recipe } from '../types';

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
  const [copied, setCopied] = useState(false);

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

  // Group items for summary display
  const groupedRecipesMap = cart.reduce<{
    [key: string]: {
      recipe: Recipe;
      count: number;
    };
  }>((acc, item) => {
    const groupKey = `${item.recipe.source}_${item.recipe.id}`;
    if (acc[groupKey]) {
      acc[groupKey].count += 1;
    } else {
      acc[groupKey] = {
        recipe: item.recipe,
        count: 1,
      };
    }
    return acc;
  }, {});

  const groupedRecipes = Object.values(groupedRecipesMap);

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

  const generateFormattedText = () => {
    let text = `🛒 *Kitchen Vault Shopping List*\n\n`;

    text += `*Planned Meals:* (${cart.length} total)\n`;
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
        if (err instanceof Error && err.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(formattedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert('Could not copy to clipboard');
    }
  };

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
          <h2 style={{ margin: 0, color: 'var(--text-h)', fontSize: '1.25rem' }}>🧾 Meal Plan Summary</h2>
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '1.5rem' }}>
              <button
                onClick={handleWhatsAppShare}
                style={{
                  backgroundColor: '#25D366',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
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
                  padding: '10px',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                📱 {copied ? 'Copied to Clipboard! ✓' : 'Share List / Copy'}
              </button>

              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
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
            </div>
          </>
        )}
      </div>
    </div>
  );
}