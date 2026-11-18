import { CanDeactivateFn } from '@angular/router';

export interface HasUnsavedChanges {
  hasUnsavedChanges(): boolean;
}

/** Asks for confirmation before leaving a form with unsaved input. */
export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (component) =>
  !component.hasUnsavedChanges() || confirm('Modifications non enregistrées. Quitter la page ?');