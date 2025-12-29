import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ProcessedError } from 'src/app/models/processed-error.interface';
import { User } from 'src/app/models/user.interface';
import { UserService } from 'src/app/service/user.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
  selector: 'app-request-token',
  templateUrl: './request-token.component.html',
  styleUrls: ['./request-token.component.scss']
})
export class RequestTokenComponent implements OnInit {
  user: User | null = null;
  public emailForm!: FormGroup;
  public isLoggedIn: boolean = false;


  constructor(private authService: AuthService, private userService: UserService, private translate: TranslateService, private loaderService: LoaderService, private toastService: ToastService, private formBuilder: FormBuilder, private router: Router) {
    this.emailForm = this.formBuilder.group({
      email: new FormControl({ value: '', disabled: false }, [Validators.required, Validators.email])
    });
   }

  ngOnInit(): void {
    this.loaderService.show();
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.authService.user$.subscribe((_user) => {
        if (_user) {
          this.userService.getUserById(_user.userTokenResponse.id).subscribe((userData) => {
            this.user = userData;
            this.emailForm.patchValue({ email: this.user?.email });
            this.emailForm.get('email')?.disable();
          })
        }
      });
    } else {
      this.emailForm.get('email')?.enable();
    }
    this.loaderService.hide();
  }

  onSubmit(): void {
    if (this.emailForm.invalid) {
      return;
    }
    this.loaderService.show();
    const email = this.emailForm.value.email;
    this.authService.requestPasswordReset(email).subscribe({
      next: () => {
        this.router.navigate(['auth/sent-token']);
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
