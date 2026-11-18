import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Stricter than Validators.email: requires a dot in the domain (a@b.co). */
export const emailValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = String(control.value ?? '').trim();
  if (!value) return null; // "required" is handled separately
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? null : { email: true };
};

/** Accepts +33 6 12 34 56 78, 06.12.34.56.78, 0612345678, etc. (8 to 15 digits). */
export const phoneValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = String(control.value ?? '').trim();
  if (!value) return null;
  const digits = value.replace(/\D/g, '');
  const validChars = /^\+?[0-9 .\-()]+$/.test(value);
  return validChars && digits.length >= 8 && digits.length <= 15 ? null : { phone: true };
};