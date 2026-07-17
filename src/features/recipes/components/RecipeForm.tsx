import { useState } from 'react';
import type { SubmitEvent } from 'react'; // Adjust or use React.FormEvent<HTMLFormElement> if preferred
import type { Ingredient } from '../types';

interface RecipeFormProps {
  onAddRecipe: (title: string, instructions: string, ingredients: Ingredient[]) => Promise<void>;
}

export default function RecipeForm({ onAddRecipe }: RecipeFormProps) {
  // Keep form states isolated right where the form lives!
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

  const handleSubmit = async (e: any) => {
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
    <form onSubmit={handleSubmit} style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #eaeaea', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
      <h3 style={{ margin: '0 0 1rem 0', color: '#111' }}>✨ Add a New Recipe</h3>
      
      <input 
        type="text"
        required 
        placeholder="Recipe Title (e.g., Garlic Bread)" 
        value={newTitle}
        onChange={(e) => setNewTitle(e.target.value)}
        style={{ width: '100%', padding: '10px 14px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' }}
      />

      <div style={{ marginBottom: '1rem' }}>
        <strong style={{ fontSize: '13px', color: '#888', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>Ingredients</strong>
        {newIngredients.map((ing, idx) => (
          <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
            <input 
              type="text" 
              placeholder="Example: Cucumber" 
              required
              value={ing.name}
              onChange={(e) => handleIngredientChange(idx, 'name', e.target.value)}
              style={{ flex: 2, padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd' }}
            />
            <input 
              type="number" 
              placeholder="Qty" 
              min="0.1"
              step="any"
              required
              value={ing.quantity}
              onChange={(e) => handleIngredientChange(idx, 'quantity', e.target.value)}
              style={{ width: '60px', padding: '8px', borderRadius: '6px', border: '1px solid #ddd' }}
            />
            <select
              value={ing.unit}
              onChange={(e) => handleIngredientChange(idx, 'unit', e.target.value)}
              style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: '#f5f5f5' }}
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
                color: newIngredients.length === 1 ? '#ccc' : '#ff4a5a',
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
          style={{ fontSize: '13px', color: '#ff4a5a', background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', fontWeight: 600 }}
        >
          ➕ Add Ingredient Row
        </button>
      </div>

      <textarea 
        placeholder="Cooking instructions..." 
        value={newInstructions}
        required
        onChange={(e) => setNewInstructions(e.target.value)}
        style={{ width: '100%', padding: '10px 14px', marginBottom: '14px', borderRadius: '6px', border: '1px solid #ddd', minHeight: '80px', boxSizing: 'border-box', fontFamily: 'inherit' }}
      />

      <button type="submit" disabled={isSubmitting} style={{ backgroundColor: '#ff4a5a', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', width: '100%', opacity: isSubmitting ? 0.7 : 1 }}>
        {isSubmitting ? 'Saving...' : 'Save to Kitchen Vault'}
      </button>
    </form>
  );
}