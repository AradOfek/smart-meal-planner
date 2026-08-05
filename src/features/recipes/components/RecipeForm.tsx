import { useState } from 'react';
import type { FormEvent } from 'react'; 
import type { Ingredient } from '../types';

interface RecipeFormProps {
  onAddRecipe: (title: string, instructions: string, ingredients: Ingredient[]) => Promise<void>;
  onSuccess?: () => void;
}

export default function RecipeForm({ onAddRecipe, onSuccess }: RecipeFormProps) {
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
      onSuccess?.();
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
        color: 'var(--text)',
        width: '100%',
        boxSizing: 'border-box'
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
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-h)'
              }}
            >
              <optgroup label="Sizes">
                <option value="small">small</option>
                <option value="medium">medium</option>
                <option value="large">large</option>
                <option value="extra large">extra large</option>
              </optgroup>

              <optgroup label="Count & Produce">
                <option value="pieces">pieces</option>
                <option value="whole">whole</option>
                <option value="cloves">cloves</option>
                <option value="slices">slices</option>
                <option value="stalks">stalks</option>
                <option value="head">head</option>
              </optgroup>

              <optgroup label="Metric Weight">
                <option value="g">g</option>
                <option value="mg">mg</option>
              </optgroup>

              <optgroup label="Metric Volume">
                <option value="ml">ml</option>
              </optgroup>

              <optgroup label="Spoons & Kitchen Measures">
                <option value="tsp">tsp</option>
                <option value="tbsp">tbsp</option>
                <option value="cups">cups</option>
                <option value="pinch">pinch</option>
                <option value="dash">dash</option>
                <option value="handful">handful</option>
              </optgroup>

              <optgroup label="Containers & Packages">
                <option value="can">can</option>
                <option value="tin">tin</option>
                <option value="bunch">bunch</option>
                <option value="pack">pack</option>
                <option value="jar">jar</option>
              </optgroup>
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