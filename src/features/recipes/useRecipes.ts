import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import type { Recipe, Ingredient, SelectedRecipe } from './types';
import { useDebounce } from './useDebounce';
import { useAuth } from '../../context/useAuth';

const PAGE_SIZE = 12;

/**
 * Primary state management hook for recipes, pagination, and multi-selection meal plans.
 * Automatically synchronizes with Supabase based on search query and authentication state.
 *
 * @param searchQuery Current user search filter input
 * @returns Object containing recipe state, pagination, and action handlers
 */
export function useRecipes(searchQuery: string = '') {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<SelectedRecipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Debounce search query to prevent excessive network requests
  const debouncedSearchQuery = useDebounce(searchQuery, 350);

  // Reset page to 1 on search query update
  useEffect(() => { setCurrentPage(1); }, [debouncedSearchQuery]);

  // Fetch paginated public recipes and user-created recipes on mount/auth change
  useEffect(() => {
    async function fetchRecipes() {
      try {
        setLoading(true);
        setError(null);

        const from = (currentPage - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        // Paginated public recipes query
        let publicQuery = supabase
          .from('recipes')
          .select('*', { count: 'exact' });

        if (debouncedSearchQuery.trim()) {
          publicQuery = publicQuery.ilike('title', `%${debouncedSearchQuery.trim()}%`);
        }

        // Authenticated user's personal recipes query
        const userQueryPromise = user
          ? (async () => {
              let query = supabase.from('user_recipes').select('*');
              if (debouncedSearchQuery.trim()) {
                query = query.ilike('title', `%${debouncedSearchQuery.trim()}%`);
              }
              return query.order('id', { ascending: false });
            })()
          : Promise.resolve({ data: [], error: null });

        const [
          { data: publicData, count, error: publicError },
          { data: userData, error: userError },
        ] = await Promise.all([
          publicQuery.range(from, to).order('id', { ascending: false }),
          userQueryPromise,
        ]);

        if (publicError) throw publicError;
        if (userError) throw userError;

        const merged = [
          ...(userData ?? []).map((r) => ({ ...r, source: 'user_recipes' as const })),
          ...(publicData ?? []).map((r) => ({ ...r, source: 'recipes' as const })),
        ];

        setRecipes(merged as Recipe[]);
        if (count !== null) setTotalCount(count);
      } catch (err: unknown) {
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

    // Reset meal selections on user logout
    if (!user) {
      setSelectedRecipes([]);
    }
  }, [currentPage, debouncedSearchQuery, user]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  /**
   * Persists a new user recipe into Supabase and updates local UI state.
   *
   * @param title Title of the recipe
   * @param instructions Markdown or plain text instructions
   * @param ingredients Array of ingredient objects
   * @param description Optional short summary description of the recipe
   */
  async function addRecipe(title: string, instructions: string, ingredients: Ingredient[], description?: string) {
    try {
      const { data, error: supabaseError } = await supabase
        .from('user_recipes')
        .insert([{ title, description, instructions: [instructions], ingredients }])
        .select();

      if (supabaseError) throw supabaseError;
      
      if (data && data.length > 0) {
        const newRecipe = { ...data[0], source: 'user_recipes' as const } as Recipe;
        setRecipes((prev) => [newRecipe, ...prev]);
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

  /**
   * Deletes a user-created recipe from Supabase and removes it from state.
   *
   * @param recipeId Database ID of the recipe to delete
   */
  async function deleteRecipe(recipeId: number) {
    const target = recipes.find((r) => r.id === recipeId && r.source === 'user_recipes');
    if (!target) return;

    if (!window.confirm("Are you sure?")) return;

    try {
      const { data, error: supabaseError } = await supabase
        .from('user_recipes')
        .delete()
        .eq('id', recipeId)
        .select();

      if (supabaseError) throw supabaseError;
      if (!data || data.length === 0) return;

      setRecipes((prev) => prev.filter((r) => !(r.id === recipeId && r.source === 'user_recipes')));
      setSelectedRecipes((prev) => prev.filter((s) => !(s.recipe.id === recipeId && s.recipe.source === 'user_recipes')));
      setTotalCount((prev) => Math.max(0, prev - 1));
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to delete recipe');
      }
    }
  }

  /**
   * Selects a recipe for meal prep, generating a unique instance selection ID.
   *
   * @param recipe The recipe object to add to the meal plan
   */
  function selectRecipe(recipe: Recipe) {
    const selectionId = `${recipe.source}_${recipe.id}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    setSelectedRecipes((prev) => [...prev, { selectionId, recipe }]);
  }

  /**
   * Removes a single selected recipe instance from the meal prep list.
   *
   * @param selectionId Unique identifier for the selected instance
   */
  function removeSelectedRecipe(selectionId: string) {
    setSelectedRecipes((prev) => prev.filter((s) => s.selectionId !== selectionId));
  }

  /**
   * Removes all selected instances of a given recipe from the meal prep list.
   *
   * @param recipeId ID of the recipe
   * @param source Table source ('recipes' or 'user_recipes')
   */
  function removeAllOfRecipe(recipeId: number, source: 'recipes' | 'user_recipes') {
    setSelectedRecipes((prev) => prev.filter((s) => !(s.recipe.id === recipeId && s.recipe.source === source)));
  }

  /**
   * Clears all selected recipes from the meal prep list.
   */
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
    removeAllOfRecipe,
    clearSelectedRecipes
  };
}