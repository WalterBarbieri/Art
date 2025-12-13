import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoggedUserGuard } from '../core/guards/logged-user.guard';
import { StaticModeGuard } from '../core/guards/static-mode.guard';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [LoggedUserGuard, StaticModeGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
