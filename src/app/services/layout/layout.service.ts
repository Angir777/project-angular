import { Injectable, effect, signal } from '@angular/core';
import { Subject } from 'rxjs';
import { AppConfig } from '../../interfaces/app-config.interface';

interface LayoutState {
  staticMenuDesktopInactive: boolean;
  overlayMenuActive: boolean;
  profileSidebarVisible: boolean;
  configSidebarVisible: boolean;
  staticMenuMobileActive: boolean;
  menuHoverActive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  // Domyślny config motywu
  _config: AppConfig = {
    ripple: false,
    inputStyle: 'outlined',
    menuMode: 'static',
    colorScheme: 'light',
    theme: 'lara-light-indigo',
    scale: 13,
  };

  config = signal<AppConfig>(this._config);

  state: LayoutState = {
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false,
  };

  private readonly localStorageKey = 'appTheme';

  private configUpdate = new Subject<AppConfig>();

  private overlayOpen = new Subject<void>();

  configUpdate$ = this.configUpdate.asObservable();

  overlayOpen$ = this.overlayOpen.asObservable();

  constructor() {
    // Pobranie z localstorage ustawień aktualnego motywu
    // localStorage.removeItem(this.localStorageKey);
    const actualTheme = localStorage.getItem(this.localStorageKey);
    if (actualTheme) {
      const parsedTheme = JSON.parse(actualTheme) as AppConfig;
      this._config = { ...this._config, ...parsedTheme };
      this.config.set(this._config);
    }

    effect(() => {
      const config = this.config();
      this.changeTheme();
      this.changeScale(config.scale);
      this.onConfigUpdate();
    });

    // Inicjalizacja stanu menu na podstawie localStorage
    const staticMenuDesktopInactive = localStorage.getItem('staticMenuDesktopInactive');
    if (staticMenuDesktopInactive !== null) {
      this.state.staticMenuDesktopInactive = JSON.parse(staticMenuDesktopInactive);
    }
  }

  updateStyle(config: AppConfig) {
    return config.theme !== this._config.theme || config.colorScheme !== this._config.colorScheme;
  }

  onMenuToggle() {
    if (this.isOverlay()) {
      this.state.overlayMenuActive = !this.state.overlayMenuActive;

      if (this.state.overlayMenuActive) {
        this.overlayOpen.next(undefined);
      }
    }

    if (this.isDesktop()) {
      this.state.staticMenuDesktopInactive = !this.state.staticMenuDesktopInactive;
      localStorage.setItem('staticMenuDesktopInactive', JSON.stringify(this.state.staticMenuDesktopInactive));
    } else {
      this.state.staticMenuMobileActive = !this.state.staticMenuMobileActive;

      if (this.state.staticMenuMobileActive) {
        this.overlayOpen.next(undefined);
      }
    }
  }

  showProfileSidebar() {
    this.state.profileSidebarVisible = !this.state.profileSidebarVisible;
    if (this.state.profileSidebarVisible) {
      this.overlayOpen.next(undefined);
    }
  }

  showConfigSidebar() {
    this.state.configSidebarVisible = true;
  }

  isOverlay() {
    return this.config().menuMode === 'overlay';
  }

  isDesktop() {
    return window.innerWidth > 991;
  }

  isMobile() {
    return !this.isDesktop();
  }

  onConfigUpdate() {
    this._config = { ...this.config() };
    this.configUpdate.next(this.config());
    // Aktualizacja zapisanych ustawień motywu
    localStorage.setItem(this.localStorageKey, JSON.stringify(this._config));
  }

  changeTheme() {
    const config = this.config();
    const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
    const themeLinkHref = themeLink.getAttribute('href')!;
    const newHref = themeLinkHref
      .split('/')
      .map((el) =>
        el == this._config.theme ? (el = config.theme) : el == `theme-${this._config.colorScheme}` ? (el = `theme-${config.colorScheme}`) : el
      )
      .join('/');

    const actualTheme = localStorage.getItem(this.localStorageKey);
    if (actualTheme) {
      const parsedTheme = JSON.parse(actualTheme) as AppConfig;
      this.replaceThemeLink('assets/layout/styles/theme/lara-' + parsedTheme.colorScheme + '-indigo/theme.css');
    } else {
      this.replaceThemeLink(newHref);
    }
  }

  replaceThemeLink(href: string) {
    const id = 'theme-css';
    const themeLink = <HTMLLinkElement>document.getElementById(id);
    const cloneLinkElement = <HTMLLinkElement>themeLink.cloneNode(true);

    cloneLinkElement.setAttribute('href', href);
    cloneLinkElement.setAttribute('id', id + '-clone');

    themeLink.parentNode!.insertBefore(cloneLinkElement, themeLink.nextSibling);
    cloneLinkElement.addEventListener('load', () => {
      themeLink.remove();
      cloneLinkElement.setAttribute('id', id);
    });
  }

  changeScale(value: number) {
    document.documentElement.style.fontSize = `${value}px`;
  }
}
