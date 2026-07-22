import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Header from './features/recipes/components/Header';
import SearchBar from './features/recipes/components/SearchBar';
import RecipeCard from './features/recipes/components/RecipeCard';
import RecipeForm from './features/recipes/components/RecipeForm';
import PrepSheet from './features/recipes/components/PrepSheet';
import type { Recipe, Ingredient } from './features/recipes/types';

export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Track recipes selected for cooking/meal planning
  const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);
  
  // Track active view: 'browse' (recipe list) vs 'prep' (grocery & menu summary)
  const [currentView, setCurrentView] = useState<'browse' | 'prep'>('browse');

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

  async function handleAddRecipe(title: string, instructions: string, ingredients: Ingredient[]) {
    try {
      const { data, error: supabaseError } = await supabase
        .from('recipes')
        .insert([{ title, instructions: [instructions], ingredients }])
        .select();

      if (supabaseError) throw supabaseError;
      if (data) setRecipes((prev) => [...prev, data[0] as Recipe]);
    } catch (err: any) {
      alert(err.message || 'Failed to add recipe');
      throw err;
    }
  }

  async function handleDeleteRecipe(recipeId: number) {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;

    try {
      const { data, error: supabaseError } = await supabase
        .from('recipes')
        .delete()
        .eq('id', recipeId)
        .select();

      if (supabaseError) throw supabaseError;
      if (!data || data.length === 0) return;

      setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
      setSelectedRecipes((prev) => prev.filter((r) => r.id !== recipeId));
    } catch (err: any) {
      alert(err.message || 'Failed to delete recipe');
    }
  }

  const handleSelectRecipe = (recipe: Recipe) => {
    setSelectedRecipes((prev) => {
      if (prev.some((r) => r.id === recipe.id)) {
        alert("This recipe is already in your menu!");
        return prev;
      }
      return [...prev, recipe];
    });
  };

  const handleRemoveSelectedRecipe = (recipeId: number) => {
    setSelectedRecipes((prev) => prev.filter((r) => r.id !== recipeId));
  };

  const handleClearMealPlan = () => setSelectedRecipes([]);

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesTitle = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIngredients = recipe.ingredients?.some((ing) => 
      ing.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? false;

    return matchesTitle || matchesIngredients;
  });

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      {/* Top Header Navigation */}
      <Header 
        selectedCount={selectedRecipes.length} 
        currentView={currentView}
        onNavigate={setCurrentView}
      />
      
      <main style={{ 
        padding: '2rem', 
        maxWidth: currentView === 'prep' ? '1000px' : '600px', 
        margin: '0 auto', 
        transition: 'max-width 0.3s ease' 
      }}>
        {currentView === 'prep' ? (
          /* 📋 2-COLUMN PREP SHEET VIEW */
          <PrepSheet 
            selectedRecipes={selectedRecipes}
            onRemoveRecipe={handleRemoveSelectedRecipe}
            onClearAll={handleClearMealPlan}
            onBack={() => setCurrentView('browse')}
          />
        ) : (
          /* 📖 BROWSE & SEARCH VIEW */
          <>
            <SearchBar query={searchQuery} setQuery={setSearchQuery} />

            <RecipeForm onAddRecipe={handleAddRecipe} />

            {loading && <p style={{ textAlign: 'center', color: 'var(--text)' }}>Fetching kitchen vault...</p>}
            {error && <p style={{ color: 'var(--accent)', textAlign: 'center' }}>⚠️ Error: {error}</p>}

            {/* Quick Floating Button to jump to Prep Sheet */}
            {selectedRecipes.length > 0 && (
              <button
                onClick={() => setCurrentView('prep')}
                style={{
                  position: 'fixed',
                  bottom: '24px',
                  right: '24px',
                  backgroundColor: 'var(--text-h)',
                  color: 'var(--bg-card)',
                  padding: '14px 22px',
                  borderRadius: '30px',
                  border: 'none',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow)',
                  zIndex: 100,
                  fontSize: '15px'
                }}
              >
                📋 View Prep Sheet ({selectedRecipes.length})
              </button>
            )}

            {!loading && !error && (
              <div style={{ marginTop: '2rem' }}>
                <p style={{ color: 'var(--text)', fontSize: '14px', marginBottom: '1rem', opacity: 0.8 }}>
                  Showing {filteredRecipes.length} of {recipes.length} recipes
                </p>

                {filteredRecipes.map((recipe) => (
                  <RecipeCard 
                    key={recipe.id} 
                    recipe={recipe} 
                    onDelete={handleDeleteRecipe}
                    onAddToCart={handleSelectRecipe}
                  />
                ))}

                {filteredRecipes.length === 0 && (
                  <p style={{ textAlign: 'center', color: 'var(--text)', opacity: 0.6, marginTop: '3rem' }}>
                    No recipes matched your search.
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}