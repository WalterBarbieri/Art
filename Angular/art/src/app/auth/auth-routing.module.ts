import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoggedUserGuard } from '../core/guards/logged-user.guard';
import { StaticModeGuard } from '../core/guards/static-mode.guard';
import { RequestTokenComponent } from './password/request-token/request-token.component';
import { SentTokenComponent } from './password/sent-token/sent-token.component';
import { ResetPasswordComponent } from './password/reset-password/reset-password.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoggedUserGuard, StaticModeGuard]
  },
  {
    path: 'request-token',
    component: RequestTokenComponent
  },
  {
    path: 'sent-token',
    component: SentTokenComponent
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
