import { useEffect, useRef } from 'react';
import RecipeForm from './RecipeForm';
import type { Ingredient } from '../types';

interface AddRecipeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRecipe: (title: string, instructions: string, ingredients: Ingredient[]) => Promise<void>;
}

export default function AddRecipeModal({ isOpen, onClose, onAddRecipe }: AddRecipeModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }
  }, [isOpen]);

  const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement, Event>) => {
    // Sync React state if user closes dialog with ESC key
    e.preventDefault();
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    // Close modal if user clicks outside dialog content (on backdrop)
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      style={{
        padding: '1.75rem',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        backgroundColor: 'var(--bg-card)',
        color: 'var(--text)',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
        width: '90%',
        maxWidth: '560px',
        maxHeight: '90vh',
        boxSizing: 'border-box',
        position: 'fixed'
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        type="button"
        aria-label="Close modal"
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'none',
          border: 'none',
          color: 'var(--text-muted)',
          fontSize: '20px',
          cursor: 'pointer',
          padding: '4px 8px',
          borderRadius: '50%',
          lineHeight: 1
        }}
      >
        ✕
      </button>

      <RecipeForm onAddRecipe={onAddRecipe} onSuccess={onClose} />
    </dialog>
  );
}
