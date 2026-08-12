import { useState } from 'react';
import type { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onDelete: (id: number) => void;
  onSelect: (recipe: Recipe) => void;
  onClickCard?: (recipe: Recipe) => void;
}

export default function RecipeCard({ recipe, onDelete, onSelect, onClickCard }: RecipeCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const canDelete = recipe.source === 'user_recipes';

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(recipe);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1200);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(recipe.id);
  };

  const instructionsText = Array.isArray(recipe.instructions)
    ? recipe.instructions.join(' ')
    : recipe.instructions || '';

  const displayDescription = recipe.description || (
    instructionsText.length > 100
      ? `${instructionsText.substring(0, 100)}...`
      : instructionsText
  );

  return (
    <div 
      onClick={() => onClickCard?.(recipe)}
      style={{
        backgroundColor: 'var(--bg-card)',
        padding: '1.5rem',
        borderRadius: 'var(--radius)',
        marginBottom: '1.25rem',
        border: '1px solid var(--border)',
        boxShadow: 'var(--shadow)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: onClickCard ? 'pointer' : 'default',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', gap: '1rem' }}>
        <div>
          <h3 style={{ margin: 0, color: 'var(--text-h)', fontSize: '1.25rem', fontWeight: 700 }}>
            {recipe.title}
          </h3>
          {canDelete && (
            <span style={{
              fontSize: '11px',
              color: 'var(--accent)',
              fontWeight: 600,
              opacity: 0.85,
              display: 'block',
              marginTop: '3px'
            }}>
              ✦ My Recipe
            </span>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
          <button
            onClick={handleSelect}
            style={{
              backgroundColor: isAdded ? 'var(--success)' : 'var(--accent-light)',
              color: isAdded ? '#ffffff' : 'var(--accent)',
              border: isAdded ? '1px solid var(--success)' : '1px solid var(--accent)',
              padding: '8px 14px',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '13px',
              transition: 'all 0.2s ease'
            }}
          >
            {isAdded ? 'Added! ✓' : '📌 Add to Menu'}
          </button>

          {canDelete && (
            <button
              onClick={handleDelete}
              title="Delete recipe"
              style={{
                backgroundColor: 'transparent',
                color: 'var(--text-muted)',
                border: 'none',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              🗑
            </button>
          )}
        </div>
      </div>

      {/* Description / Summary */}
      {displayDescription && (
        <p style={{
          fontSize: '14px',
          color: 'var(--text-muted)',
          lineHeight: 1.5,
          margin: '0 0 0.85rem 0',
          fontStyle: recipe.description ? 'italic' : 'normal',
        }}>
          {displayDescription}
        </p>
      )}

      {/* Ingredients Pills / Box */}
      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <div style={{ 
          backgroundColor: 'var(--bg-input)', 
          padding: '0.85rem 1rem', 
          borderRadius: 'var(--radius-sm)', 
          marginTop: '0.5rem' 
        }}>
          <strong style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '6px' }}>
            Ingredients ({recipe.ingredients.length})
          </strong>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '14px', color: 'var(--text)' }}>
            {recipe.ingredients.slice(0, 4).map((ing, idx) => (
              <li key={idx} style={{ marginBottom: '2px' }}>
                <strong style={{ color: 'var(--text-h)' }}>{ing.quantity} {ing.unit}</strong> {ing.name}
              </li>
            ))}
            {recipe.ingredients.length > 4 && (
              <li style={{ listStyleType: 'none', marginLeft: '-1.2rem', marginTop: '4px', fontSize: '12px', color: 'var(--accent)', fontWeight: 600 }}>
                + {recipe.ingredients.length - 4} more ingredients (click to view)
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}