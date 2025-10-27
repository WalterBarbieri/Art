import { Component } from '@angular/core';
import { ErrorService } from 'src/app/core/services/error.service';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent {

  constructor(public errorService: ErrorService) { }

}
