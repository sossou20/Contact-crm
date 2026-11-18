import { Routes } from '@angular/router';
import { unsavedChangesGuard } from './shared/guards/unsaved-changes.guard';
import { contactResolver } from './shared/resolvers/contact.resolver';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'contacts',
    title: 'Contacts',
    loadComponent: () => import('./features/contacts/contact-list').then((m) => m.ContactList),
  },
  {
    path: 'contacts/new',
    title: 'Nouveau contact',
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () => import('./features/contacts/contact-form').then((m) => m.ContactForm),
  },
  {
    path: 'contacts/:id',
    title: 'Détail du contact',
    resolve: { contact: contactResolver },
    loadComponent: () =>
      import('./features/contacts/contact-detail').then((m) => m.ContactDetail),
  },
  {
    path: 'contacts/:id/edit',
    title: 'Modifier le contact',
    resolve: { contact: contactResolver },
    canDeactivate: [unsavedChangesGuard],
    loadComponent: () => import('./features/contacts/contact-form').then((m) => m.ContactForm),
  },
  {
    path: 'favorites',
    title: 'Favoris',
    data: { favoritesOnly: true },
    loadComponent: () => import('./features/contacts/contact-list').then((m) => m.ContactList),
  },
  { path: '**', redirectTo: '' },
];
