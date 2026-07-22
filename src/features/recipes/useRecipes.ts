import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import type { Recipe, Ingredient } from './types';

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Initial fetch
  useEffect(() => {
    async function fetchRecipes() {
      try {
        setLoading(true);
        const { data, error: supabaseError } = await supabase.from('recipes').select('*');
        if (supabaseError) throw supabaseError;
        if (data) setRecipes(data as Recipe[]);
      } catch (err: any) {
        setError(err.message || 'Failed to load recipes');
      } finally {
        setLoading(false);
      }
    }
    fetchRecipes();
  }, []);

  // Handlers 
  async function addRecipe(title: string, instructions: string, ingredients: Ingredient[]) {
    const { data, error: supabaseError } = await supabase
      .from('recipes')
      .insert([{ title, instructions: [instructions], ingredients }])
      .select();

    if (supabaseError) throw supabaseError;
    if (data) setRecipes((prev) => [...prev, data[0] as Recipe]);
  }

  async function deleteRecipe(recipeId: number) {
    if (!window.confirm("Are you sure?")) return;

    const { data, error: supabaseError } = await supabase
      .from('recipes')
      .delete()
      .eq('id', recipeId)
      .select();

    if (supabaseError) throw supabaseError;
    if (!data || data.length === 0) return;

    setRecipes((prev) => prev.filter((r) => r.id !== recipeId));
    setSelectedRecipes((prev) => prev.filter((r) => r.id !== recipeId));
  }

  function selectRecipe(recipe: Recipe) {
    setSelectedRecipes((prev) => {
      if (prev.some((r) => r.id === recipe.id)) return prev; // Avoid duplicates
      return [...prev, recipe];
    });
  }

  function removeSelectedRecipe(recipeId: number) {
    setSelectedRecipes((prev) => prev.filter((r) => r.id !== recipeId));
  }

  function clearSelectedRecipes() {
    setSelectedRecipes([]);
  }

  return {
    recipes,
    selectedRecipes,
    loading,
    error,
    addRecipe,
    deleteRecipe,
    selectRecipe,
    removeSelectedRecipe,
    clearSelectedRecipes
  };
}