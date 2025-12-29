import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { SharedModule } from '../shared/shared.module';
import { RequestTokenComponent } from './password/request-token/request-token.component';
import { SentTokenComponent } from './password/sent-token/sent-token.component';
import { ResetPasswordComponent } from './password/reset-password/reset-password.component';

@NgModule({
  declarations: [
    LoginComponent,
    RequestTokenComponent,
    SentTokenComponent,
    ResetPasswordComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    AuthRoutingModule
  ]
})
export class AuthModule { }
