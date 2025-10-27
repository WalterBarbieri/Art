import { NgModule } from "@angular/core";
import { TextareaAutoresizeDirective } from "../directive/textarea-autoresize.directive";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { HttpClientModule } from '@angular/common/http';
import { ImageLoaderComponent } from "../components/loader/image-loader/image-loader.component";
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

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
    HttpClientModule,
    NgbToastModule
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    HttpClientModule,
    TextareaAutoresizeDirective,
    ImageLoaderComponent,
    NgbToastModule
  ],
})
export class SharedModule { }
