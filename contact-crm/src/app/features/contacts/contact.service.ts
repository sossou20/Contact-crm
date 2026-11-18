import { Injectable, inject, signal } from '@angular/core';
import { StorageService } from '../../core/storage.service';
import { Contact, ContactInput } from './contact.model';

const STORAGE_KEY = 'crm.contacts';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private readonly storage = inject(StorageService);
  private readonly state = signal<Contact[]>(this.storage.read<Contact>(STORAGE_KEY));

  /** Reactive, read-only list of contacts. */
  readonly contacts = this.state.asReadonly();

  getById(id: string): Contact | undefined {
    return this.state().find((c) => c.id === id);
  }

  countByCategory(categoryId: string): number {
    return this.state().filter((c) => c.categoryId === categoryId).length;
  }

  create(input: ContactInput): Contact {
    const now = new Date().toISOString();
    const contact: Contact = {
      ...this.clean(input),
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    this.persist([...this.state(), contact]);
    return contact;
  }

  update(id: string, input: ContactInput): Contact {
    const current = this.getById(id);
    if (!current) {
      throw new Error('Contact introuvable.');
    }
    const updated: Contact = {
      ...current,
      ...this.clean(input),
      updatedAt: new Date().toISOString(),
    };
    this.persist(this.state().map((c) => (c.id === id ? updated : c)));
    return updated;
  }

  delete(id: string): void {
    this.persist(this.state().filter((c) => c.id !== id));
  }

  toggleFavorite(id: string): void {
    const current = this.getById(id);
    if (current) {
      this.update(id, { ...current, favorite: !current.favorite });
    }
  }

  private clean(input: ContactInput): ContactInput {
    return {
      ...input,
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone.trim(),
      company: input.company.trim(),
      jobTitle: input.jobTitle.trim(),
      notes: input.notes.trim(),
    };
  }

  private persist(list: Contact[]): void {
    this.storage.write(STORAGE_KEY, list); // throws if it fails -> state stays unchanged
    this.state.set(list);
  }
}