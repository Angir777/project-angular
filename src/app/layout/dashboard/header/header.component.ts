import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { LayoutService } from '../../../services/layout/layout.service';
import { CommonModule } from '@angular/common';
import { faArrowRightFromBracket, faBars, faCircleHalfStroke, faGear, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../../services/auth/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { AppConfig } from '../../../interfaces/app-config.interface';
import { Language } from '../../../interfaces/language.interface';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule, TranslateModule, TooltipModule, FormsModule, DropdownModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  items!: MenuItem[];

  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  faBars = faBars;
  faUser = faUser;
  faGear = faGear;
  faArrowRightFromBracket = faArrowRightFromBracket;
  faCircleHalfStroke = faCircleHalfStroke;

  newColorTheme = 'dark';

  enableLanguageChange: boolean = environment.ENABLE_LANGUAGE_CHANGE;
  languages: Language[] = environment.LANGUAGES_AVAILABLE;
  selectedLanguage!: Language;

  constructor(
    public layoutService: LayoutService,
    private authService: AuthService,
    private translateService: TranslateService,
    private router: Router
  ) {
    this.getNewColorThreme();

    // Ustawienie wybranego języka
    const savedLanguage = localStorage.getItem('selectedLanguage');
    const isLanguagesAvailable = this.languages.some((item) => item.data.lang === savedLanguage);

    if (savedLanguage && isLanguagesAvailable) {
      this.selectedLanguage = this.languages.find((item) => item.data.lang === savedLanguage) as Language;
      this.translateService.use(savedLanguage);
    } else {
      this.selectedLanguage = this.languages.find((item) => item.data.lang === environment.DEFAULT_LANGUAGE) as Language;
      this.translateService.setDefaultLang(environment.DEFAULT_LANGUAGE);
    }
  }

  set theme(val: string) {
    this.layoutService.config.update((config) => ({
      ...config,
      theme: val,
    }));
  }

  get theme(): string {
    return this.layoutService.config().theme;
  }

  set colorScheme(val: string) {
    this.layoutService.config.update((config) => ({
      ...config,
      colorScheme: val,
    }));
  }

  get colorScheme(): string {
    return this.layoutService.config().colorScheme;
  }

  changeTheme(theme: string, colorScheme: string) {
    this.theme = theme;
    this.colorScheme = colorScheme;
    this.layoutService.onConfigUpdate();
    this.getNewColorThreme();
  }

  getNewColorThreme() {
    // localStorage.removeItem('appColorTheme');
    const actualColorTheme = localStorage.getItem('appTheme');
    if (actualColorTheme) {
      const parsedTheme = JSON.parse(actualColorTheme) as AppConfig;
      if (parsedTheme.colorScheme === 'light') {
        this.newColorTheme = 'dark';
      } else {
        this.newColorTheme = 'light';
      }
    }
    return this.newColorTheme;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {},
    });
  }

  changeLanguage(): void {
    if (this.selectedLanguage) {
      this.translateService.use(this.selectedLanguage.data.lang);
      localStorage.setItem('selectedLanguage', this.selectedLanguage.data.lang);
      location.reload();
    }
  }
}
