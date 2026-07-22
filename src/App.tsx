import { useState } from 'react';
import { useRecipes } from './features/recipes/useRecipes';
import { filterRecipes } from './features/recipes/recipeEngine';

import Header from './features/recipes/components/Header';
import SearchBar from './features/recipes/components/SearchBar';
import RecipeCard from './features/recipes/components/RecipeCard';
import RecipeForm from './features/recipes/components/RecipeForm';
import PrepSheet from './features/recipes/components/PrepSheet';

export default function App() {
  //  Brain imported in 1 line:
  const {
    recipes,
    selectedRecipes,
    loading,
    error,
    addRecipe,
    deleteRecipe,
    selectRecipe,
    removeSelectedRecipe,
    clearSelectedRecipes
  } = useRecipes();

  // Simple local UI state
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'browse' | 'prep'>('browse');

  // Filter recipes using the pure engine logic
  const filtered = filterRecipes(recipes, searchQuery);

  return (
    <div>
      <Header 
        selectedCount={selectedRecipes.length} 
        currentView={currentView} 
        onNavigate={setCurrentView} 
      />

      <main>
        {currentView === 'prep' ? (
          <PrepSheet 
            selectedRecipes={selectedRecipes}
            onRemove={removeSelectedRecipe}
            onClear={clearSelectedRecipes}
            onBack={() => setCurrentView('browse')}
          />
        ) : (
          <>
            <SearchBar query={searchQuery} setQuery={setSearchQuery} />
            <RecipeForm onAddRecipe={addRecipe} />

            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}

            {filtered.map((recipe) => (
              <RecipeCard 
                key={recipe.id} 
                recipe={recipe} 
                onDelete={deleteRecipe}
                onSelect={selectRecipe}
              />
            ))}
          </>
        )}
      </main>
    </div>
  );
}