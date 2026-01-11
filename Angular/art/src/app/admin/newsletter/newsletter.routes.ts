import { Routes } from '@angular/router';

export const newsletterRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./newsletter/newsletter.component').then(m => m.NewsletterComponent)
  }
];
