import { Routes } from '@angular/router';

export const projectsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./projects/projects.component').then(m => m.ProjectsComponent)
  },
  {
    path: 'create/:type',
    loadComponent: () => import('./project-form/project-form.component').then(m => m.ProjectFormComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./project-form/project-form.component').then(m => m.ProjectFormComponent)
  },
  {
    path: ':id/subscribers',
    loadComponent: () => import('./project-subscribers/project-subscribers.component').then(m => m.ProjectSubscribersComponent)
  }
];
