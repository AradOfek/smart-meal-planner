import { useEffect } from 'react';
import type { Recipe } from '../types';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  onClose: () => void;
  onSelect?: (recipe: Recipe) => void;
}

/**
 * Modal dialogue displaying full recipe details, ingredients list, and instructions.
 */
export default function RecipeDetailModal({ recipe, onClose, onSelect }: RecipeDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (recipe) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [recipe, onClose]);

  if (!recipe) return null;

  const instructionsList = Array.isArray(recipe.instructions)
    ? recipe.instructions
    : [recipe.instructions];

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.65)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1100,
        padding: '1rem',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'var(--bg-card)',
          color: 'var(--text)',
          padding: '2rem',
          borderRadius: '16px',
          maxWidth: '600px',
          width: '100%',
          maxHeight: '85vh',
          overflowY: 'auto',
          boxShadow: 'var(--shadow)',
          border: '1px solid var(--border)',
          position: 'relative',
        }}
      >
        {/* Header Section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ margin: 0, color: 'var(--text-h)', fontSize: '1.5rem', fontWeight: 800 }}>
               {recipe.title}
            </h2>
            {recipe.source === 'user_recipes' && (
              <span style={{ fontSize: '12px', color: 'var(--accent)', fontWeight: 600, marginTop: '4px', display: 'block' }}>
                ✦ Personal Saved Recipe
              </span>
            )}
          </div>

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
              justifyContent: 'center',
              flexShrink: 0,
            }}
            title="Close Modal"
          >
            ✕
          </button>
        </div>

        {/* Description Section */}
        {recipe.description && (
          <p style={{
            fontSize: '15px',
            color: 'var(--text-muted)',
            fontStyle: 'italic',
            lineHeight: 1.5,
            marginBottom: '1.5rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid var(--border)',
          }}>
            "{recipe.description}"
          </p>
        )}

        {/* Ingredients Section */}
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-h)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
               Ingredients Needed
            </h4>
            <div style={{ backgroundColor: 'var(--bg-input)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '15px', color: 'var(--text)' }}>
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx} style={{ marginBottom: '6px' }}>
                    <strong style={{ color: 'var(--accent)' }}>{ing.quantity} {ing.unit}</strong> — {ing.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Instructions Section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ margin: '0 0 8px 0', color: 'var(--text-h)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
             Preparation Instructions
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {instructionsList.map((step, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '12px', fontSize: '15px', lineHeight: 1.6, color: 'var(--text)' }}>
                <span style={{
                  backgroundColor: 'var(--accent-light)',
                  color: 'var(--accent)',
                  fontWeight: 700,
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  flexShrink: 0,
                  marginTop: '2px',
                }}>
                  {idx + 1}
                </span>
                <div>{step}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        {onSelect && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <button
              onClick={() => {
                onSelect(recipe);
                onClose();
              }}
              style={{
                backgroundColor: 'var(--accent)',
                color: '#ffffff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              📌 Add to Meal Prep
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
