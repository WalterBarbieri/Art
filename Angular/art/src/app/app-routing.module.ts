import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { InfoComponent } from './components/info/info.component';
import { BioComponent } from './components/bio/bio.component';
import { ContactComponent } from './components/contact/contact.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { ErrorComponent } from './components/error/error.component';
import { UserpageComponent } from './components/userpage/userpage.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
  },
  {
    path: 'info',
    component: InfoComponent
  },
  {
    path: 'projects',
    loadChildren: () => import('./components/projects/projects.module').then(m => m.ProjectsModule)
  },
  {
    path: 'bio',
    component: BioComponent
  },
  {
    path: 'contacts',
    component: ContactComponent
  },
  {
    path: 'privacy',
    component: PrivacyComponent
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'error',
    component: ErrorComponent
  },
  {
    path: 'userpage',
    component: UserpageComponent
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes),
    canActivate: [AuthGuard],
    data: { roles: ['ADMIN'] }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
