import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FullNamePipe } from '../../shared/pipes/full-name.pipe';
import { CategoryService } from '../categories/category.service';
import { ContactService } from '../contacts/contact.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, FullNamePipe],
  template: `
    <h1>Dashboard</h1>

    <div class="stats">
      <a class="stat" routerLink="/contacts">
        <strong>{{ total() }}</strong><span>Contacts</span>
      </a>
      <a class="stat" routerLink="/favorites">
        <strong>{{ favorites() }}</strong><span>Favoris</span>
      </a>
      <a class="stat" routerLink="/categories">
        <strong>{{ categoryCount() }}</strong><span>Catégories</span>
      </a>
    </div>

    <h2>Derniers ajouts</h2>
    @if (latest().length === 0) {
      <p class="empty">
        Aucun contact pour l'instant. <a routerLink="/contacts/new">Créer le premier</a>
      </p>
    }
    <ul class="latest">
      @for (c of latest(); track c.id) {
        <li>
          <a [routerLink]="['/contacts', c.id]">{{ c | fullName }}</a>
          <small>{{ c.email }}</small>
        </li>
      }
    </ul>
  `,
})
export class Dashboard {
  private readonly contactService = inject(ContactService);
  private readonly categoryService = inject(CategoryService);

  readonly total = computed(() => this.contactService.contacts().length);
  readonly favorites = computed(
    () => this.contactService.contacts().filter((c) => c.favorite).length,
  );
  readonly categoryCount = computed(() => this.categoryService.categories().length);
  readonly latest = computed(() =>
    [...this.contactService.contacts()]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, 5),
  );
}