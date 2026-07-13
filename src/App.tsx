import { useState, useEffect } from 'react';
import type { SubmitEvent } from 'react';
import { supabase } from './supabaseClient';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import RecipeCard from './components/RecipeCard';

interface Recipe {
  id: number;
  title: string;
  instructions: string;
  ingredients: string[];
}

export default function App() {
  // Master Database Arrays
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Form State
  const [newTitle, setNewTitle] = useState<string>('');
  const [newInstructions, setNewInstructions] = useState<string>('');

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

  // Form Submission Process
  async function handleAddRecipe(e: SubmitEvent) {
    e.preventDefault();

    try {
      const { data, error: supabaseError } = await supabase
        .from('recipes')
        .insert([{ title: newTitle, instructions: [newInstructions] }])
        .select();

      if (supabaseError) throw supabaseError;

      if (data) {
        setRecipes((prevRecipes) => [...prevRecipes, data[0] as Recipe]);
        setNewTitle('');
        setNewInstructions('');
      }
    } catch (err: any) {
      alert(err.message || 'Failed to add recipe');
    }
  }

  // Live Filtering Engine
  const filteredRecipes = recipes.filter((recipe) => recipe.title.toLowerCase().includes(searchQuery.toLowerCase()));

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