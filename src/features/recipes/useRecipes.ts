import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import type { Recipe, Ingredient } from './types';

const PAGE_SIZE = 12;

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Fetch paginated recipes on mount or page change
  useEffect(() => {
    async function fetchRecipes() {
      try {
        setLoading(true);
        setError(null);

        const from = (currentPage - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        const { data, count, error: supabaseError } = await supabase
          .from('recipes')
          .select('*', { count: 'exact' })
          .range(from, to)
          .order('id', { ascending: false });

        if (supabaseError) throw supabaseError;

        if (data) setRecipes(data as Recipe[]);
        if (count !== null) setTotalCount(count);
      } catch (err: unknown) {
        // Typed error check to satisfy TypeScript/ESLint
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to load recipes');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, [currentPage]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  // Handlers
  async function addRecipe(title: string, instructions: string, ingredients: Ingredient[]) {
    try {
      const { data, error: supabaseError } = await supabase
        .from('recipes')
        .insert([{ title, instructions: [instructions], ingredients }])
        .select();

      if (supabaseError) throw supabaseError;
      
      if (data && data.length > 0) {
        // Add new recipe to UI list & update total count
        setRecipes((prev) => [data[0] as Recipe, ...prev]);
        setTotalCount((prev) => prev + 1);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to add recipe');
      }
    }
  }

  async function deleteRecipe(recipeId: number) {
    if (!window.confirm("Are you sure?")) return;

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
      setTotalCount((prev) => Math.max(0, prev - 1));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to delete recipe');
      }
    }
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
    currentPage,
    totalPages,
    setCurrentPage,
    addRecipe,
    deleteRecipe,
    selectRecipe,
    removeSelectedRecipe,
    clearSelectedRecipes
  };
}