import { Pipe, PipeTransform } from '@angular/core';

interface Named {
  firstName: string;
  lastName: string;
}

@Pipe({ name: 'fullName' })
export class FullNamePipe implements PipeTransform {
  transform(person: Named): string {
    return `${person.firstName} ${person.lastName}`.trim();
  }
}