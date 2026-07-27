import { useState } from 'react';
import { useRecipes } from './features/recipes/useRecipes';
import { filterRecipes } from './features/recipes/recipeEngine';

import Header from './features/recipes/components/Header';
import SearchBar from './features/recipes/components/SearchBar';
import RecipeCard from './features/recipes/components/RecipeCard';
import RecipeForm from './features/recipes/components/RecipeForm';
import PrepSheet from './features/recipes/components/PrepSheet';
import Pagination from './features/recipes/components/Pagination';

export default function App() {
  // Global application state and CRUD handlers managed via custom hook
  const {
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
  } = useRecipes();

  // Local UI state for user search query and active view routing
  const [searchQuery, setSearchQuery] = useState('');
  const [currentView, setCurrentView] = useState<'browse' | 'prep'>('browse');

  // Filter currently loaded recipes based on the search input string
  const filtered = filterRecipes(recipes, searchQuery);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <Header 
        selectedCount={selectedRecipes.length} 
        currentView={currentView} 
        onNavigate={setCurrentView} 
      />

      <main 
        style={{ 
          maxWidth: currentView === 'prep' ? '1040px' : '1200px', 
          margin: '0 auto', 
          padding: '2.5rem 1.5rem', 
          transition: 'max-width 0.3s ease' 
        }}
      >
        {currentView === 'prep' ? (
          <PrepSheet 
            selectedRecipes={selectedRecipes}
            onRemoveRecipe={removeSelectedRecipe}
            onClearAll={clearSelectedRecipes}
            onBack={() => setCurrentView('browse')}
          />
        ) : (
          <>
            <SearchBar query={searchQuery} setQuery={setSearchQuery} />
            <RecipeForm onAddRecipe={addRecipe} />

            {/* Asynchronous operation indicators */}
            {loading && <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Loading recipes...</p>}
            {error && <p style={{ color: 'var(--accent)', marginTop: '1rem' }}>Error: {error}</p>}

            {/* Responsive recipe grid layout */}
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.25rem',
                marginTop: '1.5rem'
              }}
            >
              {filtered.map((recipe) => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  onDelete={deleteRecipe}
                  onSelect={selectRecipe}
                />
              ))}
            </div>

            {/* Server-side pagination controls */}
            {!loading && !error && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}