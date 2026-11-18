import { Pipe, PipeTransform } from '@angular/core';

interface Named {
  firstName: string;
  lastName: string;
}

@Pipe({ name: 'initials' })
export class InitialsPipe implements PipeTransform {
  transform(person: Named): string {
    return `${person.firstName.charAt(0)}${person.lastName.charAt(0)}`.toUpperCase();
  }
}