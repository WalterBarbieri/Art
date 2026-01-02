import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
    selector: 'app-toast',
    templateUrl: './toast.component.html',
    styleUrls: ['./toast.component.scss'],
    standalone: false
})
export class ToastComponent implements OnInit, OnDestroy {
  toast: Toast | null = null;
  private subscription: Subscription = new Subscription();

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.subscription = this.toastService.toast$.subscribe(toast => {
      this.toast = toast;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onHidden(): void {
    this.toastService.hideToast();
  }
}
