import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LoggedUserService } from './services/logged-user/logged-user.service';
import { filter, map, mergeMap } from 'rxjs';
import { PrimeNGConfig } from 'primeng/api';
import { ToastModule, ToastPositionType } from 'primeng/toast';
import { environment } from '../environments/environment';
import { Language } from './interfaces/language.interface';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title: string = 'Angular_APP';
  languageMenu: Language[] = environment.LANGUAGES_AVAILABLE;
  toastPosition: ToastPositionType = environment.TOAST_POSITION as ToastPositionType;

  constructor(
    private translateService: TranslateService,
    private titleService: Title,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loggedUserService: LoggedUserService,
    private primengConfig: PrimeNGConfig
  ) {
    // Wybrany język zapisany w localStorage.
    const selectedLanguage = localStorage.getItem('selectedLanguage');

    // Czy są dostępne języki?
    const isLanguagesAvailable = this.languageMenu.some((item: Language) => item.data.lang === selectedLanguage);

    // Jeśli jest zapisany to bierzemy z localstorage, a jak nie to używamy domyślny.
    if (selectedLanguage && isLanguagesAvailable) {
      this.translateService.use(selectedLanguage);
    } else {
      this.translateService.setDefaultLang(environment.DEFAULT_LANGUAGE);
    }

    // Ustawiamy tłumaczenie tytułu strony głównej i tłumaczenie tytułu podstrony.
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data)
      )
      .subscribe((data) => {
        this.translateService.get('appName').subscribe(() => {
          const pageTitle = this.translateService.instant('appName');
          let subPageTitle: string = '';
          if (data['title'] != undefined) {
            subPageTitle = this.translateService.instant(data['title']);
          }
          const completeTitle = subPageTitle ? `${pageTitle} - ${subPageTitle}` : pageTitle;
          this.titleService.setTitle(completeTitle);
        });
      });
  }

  ngOnInit() {
    // Przeładowanie uprawnień.
    this.loggedUserService.reloadPermissions();

    // PrimeNG - Ustawienie 'Ripple'.
    this.primengConfig.ripple = true;
  }
}
