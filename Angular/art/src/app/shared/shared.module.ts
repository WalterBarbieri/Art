import { NgModule } from "@angular/core";
import { TextareaAutoresizeDirective } from "../directive/textarea-autoresize.directive";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { NewlineToBrPipe } from './pipes/NewlineToBr-pipe';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ToastComponent } from './components/toast/toast.component';
import { AnimatedButtonComponent } from './components/animated-button/animated-button.component';

@NgModule({
  declarations: [
    TextareaAutoresizeDirective,
    FooterComponent,
    NavbarComponent,
    LoaderComponent,
    ToastComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    NgbToastModule,
    NewlineToBrPipe,
    RouterModule,
    AnimatedButtonComponent
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TextareaAutoresizeDirective,
    NgbToastModule,
    NewlineToBrPipe,
    FooterComponent,
    NavbarComponent,
    LoaderComponent,
    ToastComponent,
    AnimatedButtonComponent
  ],
})
export class SharedModule { }
