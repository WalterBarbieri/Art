import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthData } from '../../auth/auth.interface';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  jwtHelper = new JwtHelperService();
  baseUrl = environment.baseURL;

  private authSubj = new BehaviorSubject<null | AuthData>(null);
  utente!: AuthData;
  user$ = this.authSubj.asObservable();
  timerLogout: any;
  errorMessage: string = '';

  constructor(private HttpClient: HttpClient, private router: Router) {
    this.restore();
  }

  login(data: { email: string; password: string }) {
    return this.HttpClient.post<AuthData>(
      `${this.baseUrl}auth/login`,
      data
    ).pipe(
      tap((data) => {
        this.authSubj.next(data);
        this.utente = data;
        localStorage.setItem('user', JSON.stringify(data));
        this.autoLogout(data);
      })
    );
  }

  restore(): void {
    const user = localStorage.getItem('user');
    if (!user) return;

    try {
      const userData: AuthData = JSON.parse(user);
      if (this.jwtHelper.isTokenExpired(userData.token)) {
        localStorage.removeItem('user');
        return;
      }
      this.authSubj.next(userData);
      this.utente = userData;
      this.autoLogout(userData);
    } catch (error) {
      localStorage.removeItem('user');
    }
  }

  logout() {
    this.authSubj.next(null);
    localStorage.removeItem('user');
    this.router.navigate(['/']);
    if (this.timerLogout) {
      clearTimeout(this.timerLogout);
    }
  }

  autoLogout(data: AuthData): void {
    const expirationDate = this.jwtHelper.getTokenExpirationDate(data.token) as Date;
    const expirationDateMs = expirationDate.getTime() - new Date().getTime();
    this.timerLogout = setTimeout(() => {
      this.logout();
    }, expirationDateMs);
  }

  // HELPER METHODS
  isLoggedIn(): boolean {
    return this.authSubj.value !== null;
  }

  getCurrentUser(): AuthData | null {
    return this.authSubj.value;
  }

  getToken(): string | null {
    const userData = this.authSubj.value;
    return userData ? userData.token : null;
  }

  hasRole(role: string): boolean {
    const userData = this.authSubj.value;
    return userData ? userData.userTokenResponse.role === role : false;
  }
}
