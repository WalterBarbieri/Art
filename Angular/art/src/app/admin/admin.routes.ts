import {Routes} from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
    children: [
      { path: '', redirectTo: 'admin', pathMatch: 'full' },
    ]
  }
];
