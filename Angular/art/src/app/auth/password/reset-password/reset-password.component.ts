import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ProcessedError } from 'src/app/models/processed-error.interface';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.scss'],
    standalone: false
})
export class ResetPasswordComponent implements OnInit {
  token!: string | null;
  resetPasswordForm!: FormGroup;
  passwordMatchError: boolean = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private authService: AuthService,
    private loaderService: LoaderService,
    private router: Router,
    private translate: TranslateService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (!this.token) {
      this.toastService.showError(this.translate.instant('ERROR.TOKEN_INVALID'));
      this.router.navigate(['/auth/login']);
      return;
    }

    this.resetPasswordForm = this.fb.group({
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/)
        ],
      ],
      confirmPassword: ['', Validators.required],
    });

    this.resetPasswordForm.get('password')?.valueChanges.subscribe(() => {
      this.validatePasswordMatch();
    });

    this.resetPasswordForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.validatePasswordMatch();
    });
  }

  validatePasswordMatch() {
    const newPassword = this.resetPasswordForm.get('password')?.value;
    const confirmPassword = this.resetPasswordForm.get('confirmPassword')?.value;

    if (newPassword !== confirmPassword) {
      this.passwordMatchError = true;
    } else {
      this.passwordMatchError = false;
    }
  }

  onSubmit() {
    if (this.resetPasswordForm.valid && this.token && !this.passwordMatchError) {
      this.loaderService.show();
      const newPassword = this.resetPasswordForm.value.password;
      this.authService.resetPassword(this.token, newPassword).subscribe({
        next: () => {
          this.toastService.showSuccess(this.translate.instant('PASSWORD.RESET.SUCCESS'));
          this.router.navigate(['/auth/login']);
        },
        error: (processedError: ProcessedError) => {
          let message: string;
          if (processedError.backendMessage) {
            message = this.translate.instant(processedError.key) + ': ' + processedError.backendMessage;
          } else {
            message = this.translate.instant(processedError.key);
          }
          this.toastService.showError(message);
        },
        complete: () => {
          this.loaderService.hide();
        }
      });
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  get passwordIcon(): string {
    return this.showPassword
      ? '<i class="fas fa-eye-slash"></i>'
      : '<i class="fas fa-eye"></i>';
  }

  get confirmPasswordIcon(): string {
    return this.showConfirmPassword
      ? '<i class="fas fa-eye-slash"></i>'
      : '<i class="fas fa-eye"></i>';
  }
}
