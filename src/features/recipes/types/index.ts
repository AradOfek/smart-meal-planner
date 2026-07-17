export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id: number;
  title: string;
  instructions: string;
  ingredients?: Ingredient[]; // The "?" makes it optional so old recipes without ingredients don't crash the app
}