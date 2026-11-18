import { inject } from '@angular/core';
import { RedirectCommand, ResolveFn, Router } from '@angular/router';
import { Contact } from '../../features/contacts/contact.model';
import { ContactService } from '../../features/contacts/contact.service';

/** Preloads a contact; redirects to the list if the id does not exist. */
export const contactResolver: ResolveFn<Contact | RedirectCommand> = (route) => {
  const contact = inject(ContactService).getById(route.paramMap.get('id') ?? '');
  return contact ?? new RedirectCommand(inject(Router).parseUrl('/contacts'));
};