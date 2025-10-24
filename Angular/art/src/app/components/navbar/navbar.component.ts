import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { LanguageService } from 'src/app/service/language.service';
import { StaticAssetService } from 'src/app/service/static-asset.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isOpen: boolean = false;
  isLargeScreen!: boolean;
  logoPath: string = '';
  selectedLanguage!: string;
  private languageSubscription: Subscription = new Subscription();

  constructor(
    private cdr: ChangeDetectorRef,
    private elementRef: ElementRef,
    private staticAssetService: StaticAssetService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.languageSubscription = this.languageService.language$.subscribe((lang) => {
      this.selectedLanguage = lang;
    });

    this.logoPath = this.staticAssetService.getAssetPath('logo');

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

}
