import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { AuthData } from 'src/app/auth/auth.interface';
import { AuthService } from 'src/app/core/services/auth.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { LanguageService } from 'src/app/service/language.service';
import { StaticAssetService } from 'src/app/service/static-asset.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
    standalone: false
})
export class NavbarComponent implements OnInit, OnDestroy {
  isOpen: boolean = false;
  isLargeScreen!: boolean;
  selectedLanguage!: string;
  private languageSubscription: Subscription = new Subscription();
  user!: AuthData | null;
  isModalOpen: boolean = false;

  private modalRef!: NgbModalRef | null;

  @ViewChild('userIcon') userIcon!: ElementRef;
  @ViewChild('navbarModal') navbarModal!: ElementRef;

  constructor(
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    public staticAssetService: StaticAssetService,
    private languageService: LanguageService,
    private authService: AuthService,
    private modalService: NgbModal,
    private loaderService: LoaderService
  ) {}

  ngOnInit(): void {
    this.rechargeUser();

    this.languageSubscription = this.languageService.language$.subscribe((lang) => {
      this.selectedLanguage = lang;
    });

    document.addEventListener('click', this.onClickOutside.bind(this), true);

    this.checkScreenSize();
  }

  ngAfterViewInit() {
    this.selectedLanguage = this.languageService.getLanguage();
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.onClickOutside.bind(this), true);
    this.languageSubscription.unsubscribe();
  }

  toggleHamburgerMenu() {
    if (window.innerWidth <= 991) {
      this.isOpen = !this.isOpen;
    }
    if (!this.isOpen) {
      document.querySelector('.navbar-collapse.show')?.classList.remove('show');
      const dropdownMenu = document.querySelector('.dropdown-menu.show');
      if (dropdownMenu) {
        dropdownMenu.classList.remove('show');
      }
    }
  }

  closeHamburgerMenu() {
    if (this.isOpen) {
      this.toggleHamburgerMenu();
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    this.isLargeScreen = window.innerWidth >= 992;
  }

  private onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeHamburgerMenu();
    }
  }

  onLanguageChange(event: Event) {
    const language = (event.target as HTMLSelectElement).value;
    this.languageService.setLanguage(language);
  }

  openModal() {
    this.modalRef = this.modalService.open(this.navbarModal, {
      backdrop: 'static',
      keyboard: false,
      windowClass: 'navbar-modal'
    });
    this.modalRef.result.then(
      () => {
        this.isModalOpen = false;
      },
      () => {
        this.isModalOpen = false;
      }
    );
    this.isModalOpen = true;
  }

  closeModal() {
    if (this.modalRef) {
      this.modalRef.close();
    }
  }

  rechargeUser() {
    this.loaderService.show();
    this.authService.user$.subscribe((_user) => {
      this.user = _user;
      this.loaderService.hide();
    });
  }

  logout() {
    this.authService.logout();
  }

  onModalClose() {
    this.isModalOpen = false;
    if (this.userIcon) {
      this.userIcon.nativeElement.focus();
    }
  }

}
