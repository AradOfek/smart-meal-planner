import type { Recipe, SelectedRecipe } from './types';

/**
 * Aggregated ingredient item representation.
 */
export interface AggregatedIngredient {
  name: string;
  quantity: number;
  unit: string;
}

/**
 * Grouped recipe item representation for meal prep summaries.
 */
export interface GroupedRecipe {
  recipe: Recipe;
  count: number;
  sampleSelectionId: string;
}

/**
 * Combines and scales ingredients from a list of selected recipes.
 * Accounts for duplicate recipe instances accurately.
 *
 * @param selectedRecipes Array of selected recipe wrapper objects
 * @returns Array of aggregated ingredients with combined quantities
 */
export function aggregateSelectedIngredients(selectedRecipes: SelectedRecipe[]): AggregatedIngredient[] {
  const map: { [key: string]: AggregatedIngredient } = {};

  selectedRecipes.forEach((item) => {
    const recipe = item.recipe;
    if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) return;

    recipe.ingredients.forEach((ing) => {
      const name = (ing?.name || 'Unknown Ingredient').trim();
      const unit = (ing?.unit || 'items').trim().toLowerCase();
      const quantity = Number(ing?.quantity) || 1;

      // Grouping key (e.g. "chicken breast_g")
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

/**
 * Groups selected recipes by ID and source for meal count summaries.
 *
 * @param selectedRecipes Array of selected recipe wrapper objects
 * @returns Array of grouped recipes with instance counts
 */
export function groupSelectedRecipes(selectedRecipes: SelectedRecipe[]): GroupedRecipe[] {
  const map = selectedRecipes.reduce<{ [key: string]: GroupedRecipe }>((acc, item) => {
    const groupKey = `${item.recipe.source}_${item.recipe.id}`;
    if (acc[groupKey]) {
      acc[groupKey].count += 1;
    } else {
      acc[groupKey] = {
        recipe: item.recipe,
        count: 1,
        sampleSelectionId: item.selectionId,
      };
    }
    return acc;
  }, {});

  return Object.values(map);
}

/**
 * Formats planned meals and aggregated grocery ingredients into clean plain text
 * suitable for WhatsApp sharing, SMS, or copying to the clipboard.
 *
 * @param selectedRecipes Array of selected recipe wrapper objects
 * @returns Plain text representation of the shopping list
 */
export function generateShoppingListText(selectedRecipes: SelectedRecipe[]): string {
  const grouped = groupSelectedRecipes(selectedRecipes);
  const ingredients = aggregateSelectedIngredients(selectedRecipes);

  let text = `🛒 *Kitchen Vault Shopping List*\n\n`;

  text += `*Planned Meals:* (${selectedRecipes.length} total)\n`;
  grouped.forEach(({ recipe, count }) => {
    text += `• ${count}x ${recipe.title}\n`;
  });

  text += `\n*Ingredients Needed:*\n`;
  ingredients.forEach((item) => {
    text += `[ ] ${item.quantity} ${item.unit} — ${item.name}\n`;
  });

  text += `\n_Generated with Kitchen Vault_`;
  return text;
}

/**
 * Filters a list of recipes based on a title or ingredient search query.
 *
 * @param recipes Array of recipes to filter
 * @param query Search query string
 * @returns Filtered array of recipes
 */
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