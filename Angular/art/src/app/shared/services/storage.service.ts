import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private readonly SESSION_STORAGE_KEY_PUBLIC = 'project-filters-public';
  private readonly SESSION_STORAGE_KEY_ADMIN = 'project-filters-admin';

  constructor() { }

  setProjectFilters(filters: any, isAdmin: boolean = false): void {
    const key = isAdmin ? this.SESSION_STORAGE_KEY_ADMIN : this.SESSION_STORAGE_KEY_PUBLIC;
    try {
      sessionStorage.setItem(key, JSON.stringify(filters));
    } catch (error) {
      console.warn('Failed to save filters to session storage:', error);
    }
  }

  getProjectFilters(isAdmin: boolean = false): any | null {
    const key = isAdmin ? this.SESSION_STORAGE_KEY_ADMIN : this.SESSION_STORAGE_KEY_PUBLIC;
    try {
      const stored = sessionStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.warn('Failed to retrieve filters from session storage:', error);
      return null;
    }
  }
}
