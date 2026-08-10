import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import type { Recipe, Ingredient, SelectedRecipe } from './types';
import { useDebounce } from './useDebounce';
import { useAuth } from '../../context/useAuth';

const PAGE_SIZE = 12;

export function useRecipes(searchQuery: string = '') {
  const { user } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipes, setSelectedRecipes] = useState<SelectedRecipe[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Debounce the search query to prevent sending GET requests on every keystroke
  const debouncedSearchQuery = useDebounce(searchQuery, 350);

  // Reset page to 1 whenever the search query changes.
  useEffect(() => { setCurrentPage(1); }, [debouncedSearchQuery]);

  // Fetch paginated recipes on mount, page change, debounced search query change, or auth user change
  useEffect(() => {
    async function fetchRecipes() {
      try {
        setLoading(true);
        setError(null);

        const from = (currentPage - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        // --- Paginated public recipes ---
        let publicQuery = supabase
          .from('recipes')
          .select('*', { count: 'exact' });

        if (debouncedSearchQuery.trim()) {
          publicQuery = publicQuery.ilike('title', `%${debouncedSearchQuery.trim()}%`);
        }

        // --- All user recipes (unpaginated — personal collection is small) ---
        // If user is authenticated, query user_recipes table; otherwise resolve empty array
        const userQueryPromise = user
          ? (async () => {
              let query = supabase.from('user_recipes').select('*');
              if (debouncedSearchQuery.trim()) {
                query = query.ilike('title', `%${debouncedSearchQuery.trim()}%`);
              }
              return query.order('id', { ascending: false });
            })()
          : Promise.resolve({ data: [], error: null });

        // Run both fetches in parallel
        const [
          { data: publicData, count, error: publicError },
          { data: userData, error: userError },
        ] = await Promise.all([
          publicQuery.range(from, to).order('id', { ascending: false }),
          userQueryPromise,
        ]);

        if (publicError) throw publicError;
        if (userError) throw userError;

        // Tag each recipe with its source table, then merge (user_recipes shown first)
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

    // Clear selected recipes on auth state change (e.g., logout)
    if (!user) {
      setSelectedRecipes([]);
    }
  }, [currentPage, debouncedSearchQuery, user]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  // Handlers
  async function addRecipe(title: string, instructions: string, ingredients: Ingredient[]) {
    try {
      const { data, error: supabaseError } = await supabase
        .from('user_recipes')
        .insert([{ title, instructions: [instructions], ingredients }])
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

  function selectRecipe(recipe: Recipe) {
    const selectionId = `${recipe.source}_${recipe.id}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    setSelectedRecipes((prev) => [...prev, { selectionId, recipe }]);
  }

  function removeSelectedRecipe(selectionId: string) {
    setSelectedRecipes((prev) => prev.filter((s) => s.selectionId !== selectionId));
  }

  function removeAllOfRecipe(recipeId: number, source: 'recipes' | 'user_recipes') {
    setSelectedRecipes((prev) => prev.filter((s) => !(s.recipe.id === recipeId && s.recipe.source === source)));
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
    removeAllOfRecipe,
    clearSelectedRecipes
  };
}