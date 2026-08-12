import { useEffect, useState } from 'react';
import type { SelectedRecipe } from '../types';
import {
  aggregateSelectedIngredients,
  generateShoppingListText,
} from '../recipeEngine';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: SelectedRecipe[];
  onRemoveFromCart: (selectionId: string) => void;
  onClearCart: () => void;
}

/**
 * Modal dialogue displaying active meal plan summary, aggregated ingredient list,
 * and quick export options (WhatsApp, Web Share API, Print).
 */
export default function CheckoutModal({
  isOpen,
  onClose,
  cart,
  onRemoveFromCart,
  onClearCart,
}: CheckoutModalProps) {
  // State & Engine Hooks
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

  const combinedIngredients = aggregateSelectedIngredients(cart);

  // Handlers & Phone Sharing
  const handleWhatsAppShare = () => {
    const formattedText = generateShoppingListText(cart);
    const url = `https://wa.me/?text=${encodeURIComponent(formattedText)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    const formattedText = generateShoppingListText(cart);

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

  // Render
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
      <div 
        className="modal-container"
        style={{
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
        }}
      >
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, color: 'var(--text-h)', fontSize: '1.25rem' }}>🧾 Meal Plan Summary</h2>
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
                {combinedIngredients.map((item, idx) => (
                  <li key={idx} style={{ padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: '15px', color: 'var(--text)' }}>
                    <strong style={{ color: 'var(--accent)' }}>{item.quantity} {item.unit}</strong> — {item.name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Export & Action Controls */}
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