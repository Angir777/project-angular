import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { LayoutService } from '../../../services/layout/layout.service';
import { CommonModule } from '@angular/common';
import { faArrowRightFromBracket, faBars, faCircleHalfStroke, faGear, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AuthService } from '../../../services/auth/auth.service';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

export interface AppConfig {
  inputStyle: string;
  colorScheme: string;
  theme: string;
  ripple: boolean;
  menuMode: string;
  scale: number;
}

interface Language {
  name: string;
  code: string;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    TranslateModule,
    TooltipModule,
    FormsModule,
    DropdownModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
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

  languages: Language[] | undefined; // TODO: DO OPRACOWANIA ZMIANA JĘZYKA. Pobierz kody języków z env a potem płeładowywuj w zalezności co wybrano.
  selectedLanguage: Language | undefined;

  constructor(
    public layoutService: LayoutService,
    private authService: AuthService,
    private router: Router
  ) {
    this.getNewColorThreme();

    this.languages = [
      { name: 'PL', code: 'pl' },
      { name: 'EN', code: 'en' },
    ];

    this.selectedLanguage = this.languages.find(lang => lang.code === 'pl');
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
    this.authService
      .logout()
      .subscribe({
        next: (result) => {
          this.router.navigate(['/login']);
        },
        error: (error) => { },
      });
  }
}
