import { useState, useEffect} from 'react';
import { supabase } from './supabaseClient';
import Header from './features/recipes/components/Header';
import SearchBar from './features/recipes/components/SearchBar';
import RecipeCard from './features/recipes/components/RecipeCard';
import RecipeForm from './features/recipes/components/RecipeForm';

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

  async function handleAddRecipe(title: string, instructions: string, ingredients: Ingredient[],) {
    try {
      const { data, error: supabaseError } = await supabase
        .from('recipes')
        .insert([
          { 
            title: title, 
            instructions: [instructions], 
            ingredients: ingredients
          }
        ])
        .select();

      if (supabaseError) throw supabaseError;

      if (data) {
        setRecipes((prevRecipes) => [...prevRecipes, data[0] as Recipe]);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to add recipe');
      throw err
    }
  }

  async function handleDeleteRecipe(recipeId: number) {
  const confirmDelete = window.confirm("Are you sure you want to delete this recipe?");
  if (!confirmDelete) return;

  try {
    const { data, error: supabaseError } = await supabase
      .from('recipes')
      .delete()
      .eq('id', recipeId)
      .select();

    if (supabaseError) throw supabaseError;

    // If the database didn't actually delete anything (data is empty), stop here!
    if (!data || data.length === 0) {
      alert("Could not delete. Database rejection.");
      return;
    }

    // Only update state if the database confirms deletion was successful
    setRecipes((prevRecipes) => 
      prevRecipes.filter((recipe) => recipe.id !== recipeId)
    );
  } catch (err: any) {
    alert(err.message || 'Failed to delete recipe');
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

        <RecipeForm onAddRecipe={handleAddRecipe} />

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
              <RecipeCard key={recipe.id} 
              recipe={recipe} 
              onDelete={handleDeleteRecipe}/>
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