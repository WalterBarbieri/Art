import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  private errorMessageSubject = new BehaviorSubject<string | null>(null);
  errorMessage$ = this.errorMessageSubject.asObservable();

  // INSERIRE CHIAVE DI TRADUZIONE
  setErrorByKey(errorKey: string): void {
    this.errorMessageSubject.next(errorKey);
  }

  // HTTP ERROR METHODS
  setNetworkError(): void {
    this.errorMessageSubject.next('ERROR.NETWORK');
  }

  setUnauthorizedError(): void {
    this.errorMessageSubject.next('ERROR.UNAUTHORIZED');
  }

  setNotFoundError(): void {
    this.errorMessageSubject.next('ERROR.NOT_FOUND');
  }


  // CLEAR ERROR
  clearErrorMessage(): void {
    this.errorMessageSubject.next(null);
  }
}
