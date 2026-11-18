import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FullNamePipe } from '../../shared/pipes/full-name.pipe';
import { InitialsPipe } from '../../shared/pipes/initials.pipe';
import { CategoryService } from '../categories/category.service';
import { Contact } from './contact.model';
import { ContactService } from './contact.service';

type SortKey = 'name-asc' | 'name-desc' | 'date-desc' | 'date-asc';

const byName = (a: Contact, b: Contact): number =>
  `${a.lastName} ${a.firstName}`.localeCompare(`${b.lastName} ${b.firstName}`);

/** Used for both /contacts and /favorites (route data: favoritesOnly). */
@Component({
  selector: 'app-contact-list',
  imports: [RouterLink, FullNamePipe, InitialsPipe],
  template: `
    <div class="page-head">
      <h1>{{ favoritesRoute ? 'Favoris' : 'Contacts' }}</h1>
      <a routerLink="/contacts/new" class="btn primary">+ Nouveau contact</a>
    </div>

    <div class="toolbar">
      <input
        type="search"
        placeholder="Rechercher par nom…"
        aria-label="Rechercher un contact"
        (input)="onSearch($event)"
      />
      <select aria-label="Filtrer par catégorie" (change)="onCategory($event)">
        <option value="">Toutes les catégories</option>
        @for (cat of categories(); track cat.id) {
          <option [value]="cat.id">{{ cat.name }}</option>
        }
      </select>
      @if (!favoritesRoute) {
        <label class="inline">
          <input type="checkbox" (change)="onFavorites($event)" /> Favoris uniquement
        </label>
      }
      <select aria-label="Trier" (change)="onSort($event)">
        <option value="name-asc">Nom A → Z</option>
        <option value="name-desc">Nom Z → A</option>
        <option value="date-desc">Plus récents</option>
        <option value="date-asc">Plus anciens</option>
      </select>
    </div>

    @if (filtered().length === 0) {
      <p class="empty">Aucun contact trouvé.</p>
    }

    <div class="grid">
      @for (c of filtered(); track c.id) {
        <article class="card">
          <div class="avatar">{{ c | initials }}</div>
          <div class="info">
            <a [routerLink]="['/contacts', c.id]"
              ><strong>{{ c | fullName }}</strong></a
            >
            <small>{{ c.jobTitle }}{{ c.jobTitle && c.company ? ' · ' : '' }}{{ c.company }}</small>
            <small>{{ c.email }}</small>
            @let cat = categoryMap().get(c.categoryId);
            @if (cat) {
              <span class="badge" [style.background]="cat.color">{{ cat.name }}</span>
            }
          </div>
          <div class="actions">
            <button
              type="button"
              class="icon"
              [attr.aria-pressed]="c.favorite"
              [attr.aria-label]="c.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
              (click)="toggle(c.id)"
            >
              {{ c.favorite ? '★' : '☆' }}
            </button>
            <a class="btn" [routerLink]="['/contacts', c.id, 'edit']">Modifier</a>
            <button type="button" class="btn danger" (click)="remove(c)">Supprimer</button>
          </div>
        </article>
      }
    </div>
  `,
})
export class ContactList {
  private readonly contactService = inject(ContactService);
  private readonly categoryService = inject(CategoryService);

  readonly favoritesRoute = Boolean(inject(ActivatedRoute).snapshot.data['favoritesOnly']);
  readonly categories = this.categoryService.categories;
  readonly categoryMap = computed(() => new Map(this.categories().map((c) => [c.id, c])));

  readonly search = signal('');
  readonly categoryId = signal('');
  readonly favoritesOnly = signal(this.favoritesRoute);
  readonly sort = signal<SortKey>('name-asc');

  readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    const categoryId = this.categoryId();
    const favoritesOnly = this.favoritesOnly();

    const list = this.contactService
      .contacts()
      .filter(
        (c) =>
          (!term || `${c.firstName} ${c.lastName}`.toLowerCase().includes(term)) &&
          (!categoryId || c.categoryId === categoryId) &&
          (!favoritesOnly || c.favorite),
      );

    switch (this.sort()) {
      case 'name-asc':
        return list.sort(byName);
      case 'name-desc':
        return list.sort((a, b) => byName(b, a));
      case 'date-desc':
        return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      case 'date-asc':
        return list.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    }
  });

  onSearch(event: Event): void {
    this.search.set((event.target as HTMLInputElement).value);
  }

  onCategory(event: Event): void {
    this.categoryId.set((event.target as HTMLSelectElement).value);
  }

  onFavorites(event: Event): void {
    this.favoritesOnly.set((event.target as HTMLInputElement).checked);
  }

  onSort(event: Event): void {
    this.sort.set((event.target as HTMLSelectElement).value as SortKey);
  }

  toggle(id: string): void {
    this.contactService.toggleFavorite(id);
  }

  remove(contact: Contact): void {
    if (confirm(`Supprimer ${contact.firstName} ${contact.lastName} ?`)) {
      this.contactService.delete(contact.id);
    }
  }
}