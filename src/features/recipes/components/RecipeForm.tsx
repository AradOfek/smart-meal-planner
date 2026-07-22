import { useState } from 'react';
import type { FormEvent } from 'react'; 
import type { Ingredient } from '../types';

interface RecipeFormProps {
  onAddRecipe: (title: string, instructions: string, ingredients: Ingredient[]) => Promise<void>;
}

export default function RecipeForm({ onAddRecipe }: RecipeFormProps) {
  const [newTitle, setNewTitle] = useState<string>('');
  const [newInstructions, setNewInstructions] = useState<string>('');
  const [newIngredients, setNewIngredients] = useState<Ingredient[]>([
    { name: '', quantity: 1, unit: 'pieces' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string | number) => {
    const updated = [...newIngredients];
    if (field === 'quantity') {
      updated[index][field] = Number(value);
    } else {
      updated[index][field] = value as string;
    }
    setNewIngredients(updated);
  };

  const handleAddIngredientRow = () => {
    setNewIngredients([...newIngredients, { name: '', quantity: 1, unit: 'pieces' }]);
  };

  const handleRemoveIngredientRow = (indexToRemove: number) => {
    setNewIngredients(newIngredients.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Pass the collected form data up to the parent controller
      await onAddRecipe(newTitle, newInstructions, newIngredients);
      
      // Reset form on success
      setNewTitle('');
      setNewInstructions('');
      setNewIngredients([{ name: '', quantity: 1, unit: 'pieces' }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      style={{ 
        backgroundColor: 'var(--bg-card)', 
        color: 'var(--text)',
        padding: '1.5rem', 
        borderRadius: '12px', 
        marginBottom: '2rem', 
        border: '1px solid var(--border)', 
        boxShadow: 'var(--shadow)' 
      }}
    >
      <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-h)' }}>✨ Add a New Recipe</h3>
      
      <input 
        type="text"
        required 
        placeholder="Recipe Title (e.g., Garlic Bread)" 
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        style={{ 
          width: '100%', 
          padding: '10px 14px', 
          marginBottom: '10px', 
          borderRadius: '6px', 
          border: '1px solid var(--border)', 
          backgroundColor: 'var(--bg-input)',
          color: 'var(--text)',
          boxSizing: 'border-box' 
        }}
      />

      <div style={{ marginBottom: '1rem' }}>
        <strong style={{ fontSize: '13px', color: 'var(--text)', opacity: 0.7, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
          Ingredients
        </strong>
        {newIngredients.map((ing, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input 
              type="text" 
              placeholder="Example: Cucumber" 
              required
              value={ing.name}
              onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)}
              style={{ 
                flex: 2, 
                padding: '8px 12px', 
                borderRadius: '6px', 
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text)'
              }}
            />
            <input 
              type="number" 
              placeholder="Qty" 
              min="0.1"
              step="any"
              required
              value={ing.quantity}
              onChange={(e) => handleIngredientChange(idx, 'quantity', e.target.value)}
              style={{ 
                width: '60px', 
                padding: '8px', 
                borderRadius: '6px', 
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text)'
              }}
            />
            <select
              value={ing.unit}
              onChange={(e) => handleIngredientChange(idx, 'unit', e.target.value)}
              style={{ 
                padding: '8px', 
                borderRadius: '6px', 
                border: '1px solid var(--border)', 
                backgroundColor: 'var(--social-bg)',
                color: 'var(--text)'
              }}
            >
              <option value="pieces">pieces</option>
              <option value="g">g</option>
              <option value="cups">cups</option>
              <option value="ml">ml</option>
              <option value="tbsp">tbsp</option>
            </select>

            <button
              type="button"
              disabled={newIngredients.length === 1}
              onClick={() => handleRemoveIngredientRow(idx)}
              style={{
                background: 'none',
                border: 'none',
                color: newIngredients.length === 1 ? 'var(--border)' : 'var(--accent)',
                cursor: newIngredients.length === 1 ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                padding: '0 8px'
              }}
            >
              ✕
            </button>
          </div>
        ))}
        <button 
          type="button" 
          onClick={handleAddIngredientRow}
          style={{ 
            fontSize: '13px', 
            color: 'var(--accent)', 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            padding: '4px 0', 
            fontWeight: 600 
          }}
        >
          ➕ Add Ingredient Row
        </button>
      </div>

      <textarea 
        placeholder="Cooking instructions..." 
        value={newInstructions}
        required
        onChange={(e) => setNewInstructions(e.target.value)}
        style={{ 
          width: '100%', 
          padding: '10px 14px', 
          marginBottom: '14px', 
          borderRadius: '6px', 
          border: '1px solid var(--border)', 
          backgroundColor: 'var(--bg-input)',
          color: 'var(--text)',
          minHeight: '80px', 
          boxSizing: 'border-box', 
          fontFamily: 'inherit' 
        }}
      />

      <button 
        type="submit" 
        disabled={isSubmitting} 
        style={{ 
          backgroundColor: 'var(--accent)', 
          color: '#ffffff', 
          border: 'none', 
          padding: '10px 16px', 
          borderRadius: '6px', 
          fontWeight: 600, 
          cursor: 'pointer', 
          width: '100%', 
          opacity: isSubmitting ? 0.7 : 1 
        }}
      >
        {isSubmitting ? 'Saving...' : 'Save to Kitchen Vault'}
      </button>
    </form>
  );
}