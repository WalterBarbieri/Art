import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './projects.component';

const routes: Routes = [
  {
    path: '',
    component: ProjectsComponent
  },
  {
    path: 'courses/:id',
    loadComponent: () => import('./courses/course-detail/course-detail').then(m => m.CourseDetail)
  },
  {
    path: 'events/:id',
    loadComponent: () => import('./events/event-detail/event-detail').then(m => m.EventDetail)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectsRoutingModule { }
