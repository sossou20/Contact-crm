import { Injectable } from '@angular/core';

/** Thin wrapper around localStorage: handles JSON (de)serialisation and errors. */
@Injectable({ providedIn: 'root' })
export class StorageService {
  read<T>(key: string): T[] {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T[]) : [];
    } catch (error) {
      console.error(`Unable to read "${key}" from localStorage`, error);
      return [];
    }
  }

  write<T>(key: string, data: T[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch {
      throw new Error("Impossible d'enregistrer les données (stockage plein ou indisponible).");
    }
  }
}