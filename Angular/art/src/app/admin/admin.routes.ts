import {Routes} from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
    children: [
      { path: '', redirectTo: 'projects', pathMatch: 'full' },
      {
        path: 'projects',
        loadChildren: () => import('./projects/projects.routes').then(m => m.projectsRoutes)
      },
      {
        path: 'newsletter',
        loadChildren: () => import('./newsletter/newsletter.routes').then(m => m.newsletterRoutes)
      }
    ]
  }
];
