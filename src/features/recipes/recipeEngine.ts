import type { Recipe, Ingredient } from './types';

export interface AggregatedIngredient {
  name: string;
  quantity: number;
  unit: string;
}


 //Combines ingredients from multiple recipes into a single grocery list.
 
export function aggregateIngredients(recipes: Recipe[]): AggregatedIngredient[] {
  const map: { [key: string]: { name: string; quantity: number; unit: string } } = {};

  recipes.forEach((recipe) => {
    if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) return;

    recipe.ingredients.forEach((ing) => {
      const name = (ing?.name || 'Unknown Ingredient').trim();
      const unit = (ing?.unit || 'items').trim().toLowerCase();
      const quantity = Number(ing?.quantity) || 1;

      // Grouping key (e.g. "cucumber_pieces")
      const key = `${name.toLowerCase()}_${unit}`;

      if (map[key]) {
        map[key].quantity += quantity;
      } else {
        map[key] = { name, quantity, unit };
      }
    });
  });

  return Object.values(map);
}

//Filters recipes based on a query.

export function filterRecipes(recipes: Recipe[], query: string): Recipe[] {
  const q = query.trim().toLowerCase();
  if (!q) return recipes;

  return recipes.filter((recipe) => {
    const matchesTitle = recipe.title.toLowerCase().includes(q);
    const matchesIngredients = recipe.ingredients?.some((ing) =>
      ing.name.toLowerCase().includes(q)
    ) ?? false;

    return matchesTitle || matchesIngredients;
  });
}