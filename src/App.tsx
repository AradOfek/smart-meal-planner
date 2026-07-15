import { useState, useEffect} from 'react';
import type { SubmitEvent } from 'react';
import { supabase } from './supabaseClient';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import RecipeCard from './components/RecipeCard';

// 1. Define the structured Ingredient type
interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

// 2. Update the Recipe interface to hold the structured array
interface Recipe {
  id: number;
  title: string;
  instructions: string;
  ingredients?: Ingredient[]; // Matches what RecipeCard expects
}

export default function App() {
  // Master Database Arrays
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form States
  const [newTitle, setNewTitle] = useState<string>('');
  const [newInstructions, setNewInstructions] = useState<string>('');
  
  // 3. New state to hold dynamic ingredients before saving
  const [newIngredients, setNewIngredients] = useState<Ingredient[]>([
    { name: '', quantity: 1, unit: 'pieces' }
  ]);

  // Initial Database Load
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const { data, error: supabaseError } = await supabase.from('recipes').select('*');
        if (supabaseError) throw supabaseError;
        if (data) setRecipes(data as Recipe[]);
      } catch (err: any) {
        setError(err.message || 'Failed to connect to Supabase');
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // Handler to dynamically update a specific ingredient line
  const handleIngredientChange = (index: number, field: keyof Ingredient, value: string | number) => {
    const updated = [...newIngredients];
    if (field === 'quantity') {
      updated[index][field] = Number(value);
    } else {
      updated[index][field] = value as string;
    }
    setNewIngredients(updated);
  };

  // Handler to add a blank row to the form
  const handleAddIngredientRow = () => {
    setNewIngredients([...newIngredients, { name: '', quantity: 1, unit: 'pieces' }]);
  };

  const handleRemoveIngredientRow = (indexToRemove: number) => {
  setNewIngredients(
    newIngredients.filter((_, index) => index !== indexToRemove)
  );
};

  // Form Submission Process
  async function handleAddRecipe(e: SubmitEvent) {
    e.preventDefault();

    try {
      const { data, error: supabaseError } = await supabase
        .from('recipes')
        .insert([
          { 
            title: newTitle, 
            instructions: [newInstructions], 
            ingredients: newIngredients // Sends the dynamic JSONB structured array to Supabase
          }
        ])
        .select();

      if (supabaseError) throw supabaseError;

      if (data) {
        setRecipes((prevRecipes) => [...prevRecipes, data[0] as Recipe]);
        setNewTitle('');
        setNewInstructions('');
        setNewIngredients([{ name: '', quantity: 1, unit: 'pieces' }]); // Reset ingredients
      }
    } catch (err: any) {
      alert(err.message || 'Failed to add recipe');
    }
  }

  // Live Filtering Engine
  const filteredRecipes = recipes.filter((recipe) => {
  const matchesTitle = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
  
  const matchesIngredients = recipe.ingredients?.some((ing) => 
    ing.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) ?? false;

  return matchesTitle || matchesIngredients;
  });

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', backgroundColor: '#fafafa', color: '#333' }}>
      <Header />
      
      <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <SearchBar query={searchQuery} setQuery={setSearchQuery} />

        {/* INPUT SUBMISSION FORM */}
        <form onSubmit={handleAddRecipe} style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', border: '1px solid #eaeaea', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#111' }}>✨ Add a New Recipe</h3>
          
          <input 
            type="text"
            required 
            placeholder="Recipe Title (e.g., Garlic Bread)" 
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            style={{ width: '100%', padding: '10px 14px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' }}
          />

          {/* DYNAMIC INGREDIENT ROW FIELDS */}
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
                  style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: '#888' }}
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

          <button type="submit" style={{ backgroundColor: '#ff4a5a', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', width: '100%' }}>
            Save to Kitchen Vault
          </button>
        </form>

        {/* LOADING & ERROR STATUS BLOCKS */}
        {loading && <p style={{ textAlign: 'center', color: '#666' }}>Fetching kitchen vault...</p>}
        {error && <p style={{ color: '#ff4a5a', textAlign: 'center' }}>⚠️ Error: {error}</p>}

        {/* FILTERED DISPLAY LIST */}
        {!loading && !error && (
          <div style={{ marginTop: '2rem' }}>
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '1rem' }}>
              Showing {filteredRecipes.length} of {recipes.length} recipes
            </p>

            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}

            {filteredRecipes.length === 0 && (
              <p style={{ textAlign: 'center', color: '#999', marginTop: '3rem' }}>
                No recipes matched your search.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}