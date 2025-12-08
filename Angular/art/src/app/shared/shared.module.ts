import { NgModule } from "@angular/core";
import { TextareaAutoresizeDirective } from "../directive/textarea-autoresize.directive";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { ImageLoaderComponent } from './components/image-loader/image-loader.component';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { NewlineToBrPipe } from './pipes/NewlineToBr-pipe';
import { ProjectCardComponent } from '../components/project-card/project-card.component';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoaderComponent } from './components/loader/loader.component';
import { ToastComponent } from './components/toast/toast.component';
import { AnimatedButtonComponent } from './components/animated-button/animated-button.component';

@NgModule({
  declarations: [
    TextareaAutoresizeDirective,
    ImageLoaderComponent,
    ProjectCardComponent,
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
    ImageLoaderComponent,
    NgbToastModule,
    NewlineToBrPipe,
    ProjectCardComponent,
    FooterComponent,
    NavbarComponent,
    LoaderComponent,
    ToastComponent,
    AnimatedButtonComponent
  ],
})
export class SharedModule { }
