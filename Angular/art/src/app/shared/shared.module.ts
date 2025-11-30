import { NgModule } from "@angular/core";
import { TextareaAutoresizeDirective } from "../directive/textarea-autoresize.directive";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { ImageLoaderComponent } from "../components/loader/image-loader/image-loader.component";
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { NewlineToBrPipe } from './pipes/NewlineToBr-pipe';

@NgModule({
  declarations: [
    TextareaAutoresizeDirective,
    ImageLoaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    NgbToastModule,
    NewlineToBrPipe
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TextareaAutoresizeDirective,
    ImageLoaderComponent,
    NgbToastModule,
    NewlineToBrPipe
  ],
})
export class SharedModule { }
