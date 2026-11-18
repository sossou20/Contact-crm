import { Injectable, inject, signal } from '@angular/core';
import { StorageService } from '../../core/storage.service';
import { ContactService } from '../contacts/contact.service';
import { Category, CategoryInput } from './category.model';

const STORAGE_KEY = 'crm.categories';

const DEFAULTS: CategoryInput[] = [
  { name: 'Étudiants', color: '#3b82f6' },
  { name: 'Entreprises', color: '#10b981' },
  { name: 'Clients', color: '#f59e0b' },
  { name: 'Partenaires', color: '#8b5cf6' },
];

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly storage = inject(StorageService);
  private readonly contactService = inject(ContactService);
  private readonly state = signal<Category[]>(this.load());

  readonly categories = this.state.asReadonly();

  getById(id: string): Category | undefined {
    return this.state().find((c) => c.id === id);
  }

  create(input: CategoryInput): Category {
    const category: Category = {
      name: input.name.trim(),
      color: input.color,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    this.persist([...this.state(), category]);
    return category;
  }

  update(id: string, input: CategoryInput): Category {
    const current = this.getById(id);
    if (!current) {
      throw new Error('Catégorie introuvable.');
    }
    const updated: Category = { ...current, name: input.name.trim(), color: input.color };
    this.persist(this.state().map((c) => (c.id === id ? updated : c)));
    return updated;
  }

  /** Business rule: a category that still contains contacts cannot be deleted. */
  delete(id: string): void {
    const count = this.contactService.countByCategory(id);
    if (count > 0) {
      const name = this.getById(id)?.name ?? '';
      throw new Error(
        `Impossible de supprimer « ${name} » : ${count} contact(s) y sont encore associé(s).`,
      );
    }
    this.persist(this.state().filter((c) => c.id !== id));
  }

  private load(): Category[] {
    const stored = this.storage.read<Category>(STORAGE_KEY);
    if (stored.length > 0) {
      return stored;
    }
    const now = new Date().toISOString();
    const seeded: Category[] = DEFAULTS.map((d) => ({
      ...d,
      id: crypto.randomUUID(),
      createdAt: now,
    }));
    this.storage.write(STORAGE_KEY, seeded);
    return seeded;
  }

  private persist(list: Category[]): void {
    this.storage.write(STORAGE_KEY, list);
    this.state.set(list);
  }
}