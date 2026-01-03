import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { ProcessedError } from '../../models/processed-error.interface';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private errorMessageSubject = new BehaviorSubject<string | null>(null);
  errorMessage$ = this.errorMessageSubject.asObservable();

  constructor() {}

  // UNIFIED METHOD

  processHttpError(error: any): ProcessedError {
    const errorMsg = error.error?.message || error.error || error.message || '';

    if (!(error instanceof HttpErrorResponse)) {
      return { key: 'ERROR.UNKNOWN', backendMessage: 'Unknown error' };
    }
    switch (error.status) {
      case 0:
        return { key: 'ERROR.NETWORK' };

      case 400:
        return this.processBadRequestError(errorMsg);

      case 401:
        return this.processUnauthorizedError(errorMsg);

      case 403:
        return { key: 'ERROR.FORBIDDEN' };

      case 404:
        return this.processNotFoundError(errorMsg);

      case 422:
        return { key: 'ERROR.VALIDATION', backendMessage: errorMsg };

      case 500:
        return this.processInternalServerError(errorMsg);

      default:
        return {
          key: 'ERROR.GENERIC',
          backendMessage: errorMsg || 'Unknown server error',
        };
    }
  }

  // HANDLERS

  private processBadRequestError(errorMsg: string): ProcessedError {
    if (errorMsg.includes('Privacy policy must be accepted')) {
      return { key: 'VALIDATION.PRIVACY_REQUIRED' };
    }
    if (errorMsg.includes('Liability release must be accepted')) {
      return { key: 'VALIDATION.LIABILITY_REQUIRED' };
    }
    if (errorMsg.includes('Photo and video consent must be accepted')) {
      return { key: 'VALIDATION.PHOTO_CONSENT_REQUIRED' };
    }

    return {
      key: 'ERROR.BAD_REQUEST',
      backendMessage: errorMsg,
    };
  }

  private processUnauthorizedError(errorMsg: string): ProcessedError {
    if (errorMsg.includes('Invalid credentials')) {
      return { key: 'ERROR.CREDENTIAL' };
    }
    if (errorMsg.includes('Invalid token')) {
      return { key: 'ERROR.TOKEN_INVALID' };
    }

    return {
      key: 'ERROR.UNAUTHORIZED',
      backendMessage: errorMsg,
    };
  }

  private processNotFoundError(errorMsg: string): ProcessedError {
    const notFoundMatch = errorMsg.match(/^(.+) not found$/);

    if (notFoundMatch) {
      const identifier = notFoundMatch[1];
      return {
        key: 'ERROR.NOT_FOUND_WITH_ID',
        backendMessage: identifier,
      };
    }

    return {
      key: 'ERROR.NOT_FOUND',
      backendMessage: errorMsg,
    };
  }

  private processInternalServerError(errorMsg: string): ProcessedError {
    if (errorMsg.includes('Email sending failed')) {
      // Remove technical details from the message
      const cleanMessage = errorMsg.replace('Email sending failed: ', '');
      return {
        key: 'ERROR.EMAIL_SEND_FAILED',
        backendMessage: cleanMessage
      };
    }

    return {
      key: 'ERROR.GENERIC',
      backendMessage: errorMsg,
    };
  }

  // METHODS FOR GLOBAL ERROR COMPONENT

  setErrorByKey(errorKey: string): void {
    this.errorMessageSubject.next(errorKey);
  }

  setHttpErrorForGlobalDisplay(error: any): void {
    const errorKey = this.processHttpError(error).key;
    this.errorMessageSubject.next(errorKey);
  }

  // CLEAR ERROR
  clearErrorMessage(): void {
    this.errorMessageSubject.next(null);
  }
}
