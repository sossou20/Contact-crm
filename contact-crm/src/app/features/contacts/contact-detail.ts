import { DatePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FullNamePipe } from '../../shared/pipes/full-name.pipe';
import { InitialsPipe } from '../../shared/pipes/initials.pipe';
import { CategoryService } from '../categories/category.service';
import { ContactService } from './contact.service';

@Component({
  selector: 'app-contact-detail',
  imports: [RouterLink, DatePipe, FullNamePipe, InitialsPipe],
  template: `
    @let c = contact();
    @if (c) {
      <div class="page-head">
        <div class="title-with-avatar">
          <div class="avatar big">{{ c | initials }}</div>
          <div>
            <h1>{{ c | fullName }}</h1>
            @if (category(); as cat) {
              <span class="badge" [style.background]="cat.color">{{ cat.name }}</span>
            }
          </div>
        </div>
        <button
          type="button"
          class="icon big"
          [attr.aria-pressed]="c.favorite"
          [attr.aria-label]="c.favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'"
          (click)="toggleFavorite()"
        >
          {{ c.favorite ? '★' : '☆' }}
        </button>
      </div>

      <dl class="details">
        <dt>Email</dt>
        <dd>
          <a [href]="'mailto:' + c.email">{{ c.email }}</a>
        </dd>
        <dt>Téléphone</dt>
        <dd>{{ c.phone }}</dd>
        <dt>Entreprise</dt>
        <dd>{{ c.company || '—' }}</dd>
        <dt>Poste</dt>
        <dd>{{ c.jobTitle || '—' }}</dd>
        <dt>Notes</dt>
        <dd>{{ c.notes || '—' }}</dd>
        <dt>Créé le</dt>
        <dd>{{ c.createdAt | date: 'dd/MM/yyyy HH:mm' }}</dd>
        <dt>Modifié le</dt>
        <dd>{{ c.updatedAt | date: 'dd/MM/yyyy HH:mm' }}</dd>
      </dl>

      <div class="form-actions">
        <a class="btn primary" [routerLink]="['/contacts', c.id, 'edit']">Modifier</a>
        <button type="button" class="btn danger" (click)="remove()">Supprimer</button>
        <a class="btn" routerLink="/contacts">← Retour</a>
      </div>
    }
  `,
})
export class ContactDetail {
  private readonly contactService = inject(ContactService);
  private readonly categoryService = inject(CategoryService);
  private readonly router = inject(Router);
  private readonly id = inject(ActivatedRoute).snapshot.paramMap.get('id') ?? '';

  readonly contact = computed(() => this.contactService.getById(this.id));
  readonly category = computed(() => {
    const categoryId = this.contact()?.categoryId;
    return categoryId ? this.categoryService.getById(categoryId) : undefined;
  });

  toggleFavorite(): void {
    this.contactService.toggleFavorite(this.id);
  }

  remove(): void {
    if (confirm('Supprimer définitivement ce contact ?')) {
      this.contactService.delete(this.id);
      void this.router.navigate(['/contacts']);
    }
  }
}