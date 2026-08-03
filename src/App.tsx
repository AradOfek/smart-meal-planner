import { useState } from 'react';
import { useRecipes } from './features/recipes/useRecipes';

import Header from './features/recipes/components/Header';
import SearchBar from './features/recipes/components/SearchBar';
import RecipeCard from './features/recipes/components/RecipeCard';
import PrepSheet from './features/recipes/components/PrepSheet';
import Pagination from './features/recipes/components/Pagination';

export default function App() {
  // Navigation and UI state
  const [currentView, setCurrentView] = useState<'landing' | 'browse' | 'prep'>('landing');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
  } = useRecipes(searchQuery);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <Header 
        selectedCount={selectedRecipes.length} 
        currentView={currentView} 
        onNavigate={setCurrentView}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      <main 
        style={{ 
          maxWidth: currentView === 'prep' ? '1040px' : '1200px', 
          margin: '0 auto', 
          padding: '2.5rem 1.5rem', 
          transition: 'max-width 0.3s ease' 
        }}
      >
        {/* VIEW 1: LANDING PAGE */}
        {currentView === 'landing' && (
          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>What are you cooking today?</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Search your saved vault or browse full collection.
            </p>

            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <SearchBar query={searchQuery} setQuery={setSearchQuery} />
            </div>

            {/* Results appear only when typing */}
            {searchQuery.trim().length > 0 && (
              <div 
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1.25rem',
                  marginTop: '2.5rem',
                  textAlign: 'left'
                }}
              >
                {recipes.length > 0 ? (
                  recipes.map((recipe) => (
                    <RecipeCard 
                      key={recipe.id} 
                      recipe={recipe} 
                      onDelete={deleteRecipe}
                      onSelect={selectRecipe}
                    />
                  ))
                ) : (
                  <p style={{ gridColumn: '1 / -1', color: 'var(--text-muted)' }}>
                    No recipes found matching "{searchQuery}"
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: BROWSE ALL PAGE */}
        {currentView === 'browse' && (
          <>
            <SearchBar query={searchQuery} setQuery={setSearchQuery} />

            {loading && <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Loading recipes...</p>}
            {error && <p style={{ color: 'var(--accent)', marginTop: '1rem' }}>Error: {error}</p>}

            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1.25rem',
                marginTop: '1.5rem'
              }}
            >
              {recipes.map((recipe) => (
                <RecipeCard 
                  key={recipe.id} 
                  recipe={recipe} 
                  onDelete={deleteRecipe}
                  onSelect={selectRecipe}
                />
              ))}
            </div>

            {!loading && !error && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}

        {/* VIEW 3: PREP SHEET */}
        {currentView === 'prep' && (
          <PrepSheet 
            selectedRecipes={selectedRecipes}
            onRemoveRecipe={removeSelectedRecipe}
            onClearAll={clearSelectedRecipes}
            onBack={() => setCurrentView('browse')}
          />
        )}
      </main>
    </div>
  );
}