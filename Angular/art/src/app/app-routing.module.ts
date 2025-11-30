import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { InfoComponent } from './components/info/info.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { BioComponent } from './components/bio/bio.component';
import { ContactComponent } from './components/contact/contact.component';
import { PrivacyComponent } from './components/privacy/privacy.component';
import { LoginComponent } from './auth/login/login.component';
import { ErrorComponent } from './components/error/error.component';
import { LoggedUserGuard } from './core/guards/logged-user.guard';
import { UserpageComponent } from './components/userpage/userpage.component';

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
    component: ProjectsComponent
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
    path: 'login',
    component: LoginComponent,
    canActivate: [LoggedUserGuard]
  },
  {
    path: 'error',
    component: ErrorComponent
  },
  {
    path: 'userpage',
    component: UserpageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
