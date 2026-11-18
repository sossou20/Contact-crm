import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AutofocusDirective } from '../../shared/directives/autofocus.directive';
import { HasUnsavedChanges } from '../../shared/guards/unsaved-changes.guard';
import { emailValidator, phoneValidator } from '../../shared/validators/validators';
import { CategoryService } from '../categories/category.service';
import { Contact } from './contact.model';
import { ContactService } from './contact.service';

type FieldName = 'firstName' | 'lastName' | 'email' | 'phone' | 'notes';

/** Shared by /contacts/new and /contacts/:id/edit (prefilled by the resolver). */
@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule, RouterLink, AutofocusDirective],
  template: `
    <h1>{{ isEdit ? 'Modifier le contact' : 'Nouveau contact' }}</h1>

    @if (error()) {
      <p class="alert" role="alert">{{ error() }}</p>
    }

    <form [formGroup]="form" (ngSubmit)="submit()" novalidate class="form">
      <div class="row">
        <div class="field">
          <label for="firstName">Prénom *</label>
          <input id="firstName" formControlName="firstName" appAutofocus />
          <small class="error">{{ errorMessage('firstName') }}</small>
        </div>
        <div class="field">
          <label for="lastName">Nom *</label>
          <input id="lastName" formControlName="lastName" />
          <small class="error">{{ errorMessage('lastName') }}</small>
        </div>
      </div>

      <div class="row">
        <div class="field">
          <label for="email">Email *</label>
          <input id="email" type="email" formControlName="email" />
          <small class="error">{{ errorMessage('email') }}</small>
        </div>
        <div class="field">
          <label for="phone">Téléphone *</label>
          <input id="phone" type="tel" formControlName="phone" />
          <small class="error">{{ errorMessage('phone') }}</small>
        </div>
      </div>

      <div class="row">
        <div class="field">
          <label for="company">Entreprise</label>
          <input id="company" formControlName="company" />
        </div>
        <div class="field">
          <label for="jobTitle">Poste</label>
          <input id="jobTitle" formControlName="jobTitle" />
        </div>
      </div>

      <div class="field">
        <label for="categoryId">Catégorie</label>
        <select id="categoryId" formControlName="categoryId">
          <option value="">Aucune</option>
          @for (cat of categories(); track cat.id) {
            <option [value]="cat.id">{{ cat.name }}</option>
          }
        </select>
      </div>

      <div class="field">
        <label for="notes">Notes</label>
        <textarea id="notes" rows="4" formControlName="notes"></textarea>
        <small class="error">{{ errorMessage('notes') }}</small>
      </div>

      <label class="inline"><input type="checkbox" formControlName="favorite" /> Favori</label>

      <div class="form-actions">
        <button type="submit" class="btn primary">Enregistrer</button>
        <a routerLink="/contacts" class="btn">Annuler</a>
      </div>
    </form>
  `,
})
export class ContactForm implements HasUnsavedChanges {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly router = inject(Router);
  private readonly contactService = inject(ContactService);
  private readonly existing =
    (inject(ActivatedRoute).snapshot.data['contact'] as Contact | undefined) ?? null;
  private saved = false;

  readonly categories = inject(CategoryService).categories;
  readonly isEdit = this.existing !== null;
  readonly error = signal('');

  readonly form = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, emailValidator]],
    phone: ['', [Validators.required, phoneValidator]],
    company: [''],
    jobTitle: [''],
    categoryId: [''],
    favorite: [false],
    notes: ['', Validators.maxLength(500)],
  });

  constructor() {
    if (this.existing) {
      this.form.patchValue(this.existing); // unknown keys (id, dates) are ignored
    }
  }

  errorMessage(name: FieldName): string {
    const control = this.form.controls[name];
    if (!control.errors || !(control.touched || control.dirty)) return '';
    if (control.errors['required']) return 'Ce champ est obligatoire.';
    if (control.errors['minlength']) return 'Minimum 2 caractères.';
    if (control.errors['email']) return "Format d'email invalide (ex : nom@domaine.fr).";
    if (control.errors['phone']) return 'Numéro invalide (8 à 15 chiffres).';
    if (control.errors['maxlength']) return 'Maximum 500 caractères.';
    return 'Valeur invalide.';
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    try {
      const value = this.form.getRawValue();
      if (this.existing) {
        this.contactService.update(this.existing.id, value);
      } else {
        this.contactService.create(value);
      }
      this.saved = true;
      void this.router.navigate(['/contacts']);
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Erreur inattendue.');
    }
  }

  hasUnsavedChanges(): boolean {
    return this.form.dirty && !this.saved;
  }
}