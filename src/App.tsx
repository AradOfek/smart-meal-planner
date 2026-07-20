import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import Header from './features/recipes/components/Header';
import SearchBar from './features/recipes/components/SearchBar';
import RecipeCard from './features/recipes/components/RecipeCard';
import RecipeForm from './features/recipes/components/RecipeForm';
import CheckoutModal from './features/recipes/components/CheckoutModal';
import type { Recipe, Ingredient } from './features/recipes/types';

export default function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<Recipe[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

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

  async function handleAddRecipe(title: string, instructions: string, ingredients: Ingredient[]) {
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
      throw err;
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

      if (!data || data.length === 0) {
        alert("Could not delete. Database rejection.");
        return;
      }

      setRecipes((prevRecipes) => 
        prevRecipes.filter((recipe) => recipe.id !== recipeId)
      );
    } catch (err: any) {
      alert(err.message || 'Failed to delete recipe');
    }
  }

  // Add a recipe to the checkout (prevents duplicates)
  const handleAddToCart = (recipeToAdd: Recipe) => {
    setCart((prevCart) => {
      if (prevCart.some((r) => r.id === recipeToAdd.id)) {
        alert("This recipe is already in your checkout!");
        return prevCart;
      }
      return [...prevCart, recipeToAdd];
    });
  };

  // Remove a recipe from the checkout
  const handleRemoveFromCart = (recipeId: number) => {
    setCart((prevCart) => prevCart.filter((r) => r.id !== recipeId));
  };

  // Clear the entire checkout
  const handleClearCart = () => setCart([]);

  // Live Filtering Engine
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesTitle = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesIngredients = recipe.ingredients?.some((ing) => 
      ing.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? false;

    return matchesTitle || matchesIngredients;
  });

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', backgroundColor: 'var(--bg)'}}>
      <Header />
      
      <main style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <SearchBar query={searchQuery} setQuery={setSearchQuery} />

        <RecipeForm onAddRecipe={handleAddRecipe} />

        {/* LOADING & ERROR STATUS BLOCKS */}
        {loading && <p style={{ textAlign: 'center', color: 'var(--text)' }}>Fetching kitchen vault...</p>}
        {error && <p style={{ color: 'var(--accent)', textAlign: 'center' }}>⚠️ Error: {error}</p>}

        {/* Floating Checkout Trigger Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            backgroundColor: 'var(--text-h)',
            color: 'var(--bg-card)',
            padding: '12px 20px',
            borderRadius: '30px',
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: 'var(--shadow)',
            zIndex: 100
          }}
        >
          🛒 View Checkout ({cart.length})
        </button>

        <CheckoutModal
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cart={cart}
          onRemoveFromCart={handleRemoveFromCart}
          onClearCart={handleClearCart}
        />

        {/* FILTERED DISPLAY LIST */}
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
                onAddToCart={handleAddToCart}
              />
            ))}

            {filteredRecipes.length === 0 && (
              <p style={{ textAlign: 'center', color: 'var(--text)', opacity: 0.6, marginTop: '3rem' }}>
                No recipes matched your search.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}