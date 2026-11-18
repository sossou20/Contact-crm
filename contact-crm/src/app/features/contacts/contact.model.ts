export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  jobTitle: string;
  categoryId: string;
  favorite: boolean;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

/** Data entered by the user (id and timestamps are generated). */
export type ContactInput = Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>;