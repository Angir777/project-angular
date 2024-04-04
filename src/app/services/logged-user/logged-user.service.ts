import { Injectable } from '@angular/core';
import { LoggedUser } from '../../models/auth/logged-user.model';
import { Token } from '../../models/auth/token';
import { NgxPermissionsService } from 'ngx-permissions';
import { CREDENTIALS_KEY } from '../../constants/global';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class LoggedUserService {
  
  static readonly loggedUserKey: string = CREDENTIALS_KEY;
  private loggedUser: LoggedUser | null = null;

  constructor(
    private permissionService: NgxPermissionsService,
  ) {
    const savedLoggedUser = sessionStorage.getItem(LoggedUserService.loggedUserKey) || localStorage.getItem(LoggedUserService.loggedUserKey);
    if (savedLoggedUser) {
      this.loggedUser = JSON.parse(savedLoggedUser);
    }
  }

  // Czy user jest zautoryzowany
  isAuthenticated(): boolean {
    return this.loggedUser !== null;
  }

  // Pobranie uprawnień usera
  getPermissions(): string[] {
    const permissions: string[] = [];
    if (this.loggedUser != null) {
      this.loggedUser.permissions.forEach((permission, index) => {
        if (permission.name !== null) {
          permissions.push(permission.name);
        }
      });
    }
    return permissions;
  }

  // Przeładowanie uprawnień usera
  reloadPermissions() {
    if (!_.isNil(this.loggedUser)) {
      this.permissionService.flushPermissions();
      this.permissionService.loadPermissions(this.getPermissions());
    }
  }

  // Wyczyszczenie uprawnień / wylogowanie
  flush() {
    this.permissionService.flushPermissions();
    this.set();
  }

  // Ustawianie danych usera
  set(authUser?: LoggedUser, remember?: boolean) {
    this.loggedUser = authUser || null;

    if (this.loggedUser) {
      // Jeśli użytkownik zaznaczy przy logowaniu by go zapamiętać,
      // to po zamknięciu przeglądaki nadal będzie zalogowany, 
      // aż się sam nie wyloguje lub localstorage się nie wyczyści
      const selectedStorage = remember ? localStorage : sessionStorage;
      selectedStorage.setItem(
        LoggedUserService.loggedUserKey,
        JSON.stringify(this.loggedUser)
      );
      this.permissionService.loadPermissions(this.getPermissions());
    } else {
      sessionStorage.removeItem(LoggedUserService.loggedUserKey);
      localStorage.removeItem(LoggedUserService.loggedUserKey);
    }
  }

  // Pobranie danych usera
  get(): LoggedUser | null {
    return this.loggedUser;
  }

  // Pobranie tokenu
  getToken(): Token | null {
    if (this.loggedUser != null) {
      return this.loggedUser.token;
    }
    return null;
  }

  // Pobranie header tokenu
  getTokenHeader(): string | null {
    if (this.loggedUser != null) {
      return `${this.loggedUser.tokenType} ${this.loggedUser?.token}`;
    }
    return null;
  }
}
