import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AuthData } from 'src/app/auth/auth.interface';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { ProcessedError } from 'src/app/models/processed-error.interface';
import { User } from 'src/app/models/user.interface';
import { UserService } from 'src/app/service/user.service';
import { ToastService } from 'src/app/shared/services/toast.service';

@Component({
    selector: 'app-userpage',
    templateUrl: './userpage.component.html',
    styleUrls: ['./userpage.component.scss'],
    standalone: false
})
export class UserpageComponent implements OnInit {
  loggedUser!: AuthData | null;
  user!: User | null;

  constructor(
    private userService: UserService,
    private loader: LoaderService,
    private auth: AuthService,
    private toast: ToastService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loader.show();
    this.auth.user$.subscribe((_user) => {
      this.loggedUser = _user;
      if (this.loggedUser) {
        this.userService
          .getUserById(this.loggedUser.userTokenResponse.id)
          .subscribe({
            next: (userData) => {
              this.user = userData;
            },
            error: (processedError: ProcessedError) => {
              let message: string;
              if (processedError.backendMessage) {
                message =
                  this.translate.instant(processedError.key) +
                  ': ' +
                  processedError.backendMessage;
              } else {
                message = this.translate.instant(processedError.key);
              }
              this.toast.showError(message);
            },
            complete: () => {
              this.loader.hide();
            },
          });
      }
    });
    this.loader.hide();
  }

  logout() {
    this.auth.logout();
  }
}
