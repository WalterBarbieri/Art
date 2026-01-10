import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LoaderService } from 'src/app/core/services/loader.service';
import { TranslateService } from '@ngx-translate/core';
import { ProcessedError } from 'src/app/models/processed-error.interface';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: false
})
export class LoginComponent implements OnInit {
  error!: string;
  showAlert: boolean = true;
  email: string | null = null;
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loaderService: LoaderService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {}

  login(form: NgForm): void {
    this.loaderService.show();
    this.email = form.value.email;

    this.authService.login(form.value).subscribe({
      next: (response) => {
        this.router.navigate(['/'], {
          queryParams: { message: 'LoginSuccess' },
        });
      },
      error: (processedError: ProcessedError) => {
        form.reset();
        if (processedError.backendMessage) {
          this.error =
            this.translate.instant(processedError.key) + ': ' + processedError.backendMessage;
        } else {
          this.error = this.translate.instant(processedError.key);
        }
      },
      complete: () => {
        this.loaderService.hide();
      },
    });
  }

  chiudiAlert() {
    this.showAlert = false;
    this.error = '';
    this.showAlert = true;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  get passwordIcon(): string {
    return this.showPassword
      ? '<i class="fas fa-eye-slash"></i>'
      : '<i class="fas fa-eye"></i>';
  }
}
