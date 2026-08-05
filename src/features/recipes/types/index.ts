export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: number;
  title: string;
  instructions: string | string[]; // string[] for user_recipes (text[]), string for recipes
  ingredients?: Ingredient[]; // The "?" makes it optional so old recipes without ingredients don't crash the app
  source: 'recipes' | 'user_recipes'; // which table this recipe came from
}