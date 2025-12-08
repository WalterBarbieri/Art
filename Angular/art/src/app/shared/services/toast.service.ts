import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  type: ToastType;
  message: string;
  delay?: number; // in ms, default 5000
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new BehaviorSubject<Toast | null>(null);
  public toast$ = this.toastSubject.asObservable();

  constructor() {}

  showToast(type: ToastType, message: string, delay: number = 5000): void {
    this.toastSubject.next({ type, message, delay });
  }

  hideToast(): void {
    this.toastSubject.next(null);
  }

  showSuccess(message: string, delay?: number): void {
    this.showToast('success', message, delay);
  }

  showError(message: string, delay?: number): void {
    this.showToast('error', message, delay);
  }

  showInfo(message: string, delay?: number): void {
    this.showToast('info', message, delay);
  }
}
