import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { LoggedUserService } from '../logged-user/logged-user.service';
import { LoginInterface } from '../../interfaces/login.interface';
import { LoggedUser } from '../../models/auth/logged-user.model';
import { environment } from '../../../environments/environment.dev';
import { RegisterInterface } from '../../interfaces/register.interface';
import { PasswordResetInterface } from '../../interfaces/password-reset.interface';
import { FinishResetPasswordInterface } from '../../interfaces/finish-reset-password.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private loggedUserService: LoggedUserService
  ) {}

  // Logowanie.
  login(authenticationData: LoginInterface): Observable<HttpResponse<LoggedUser>> {
    return this.http
      .post<LoggedUser>(environment.serverUrl + 'auth/login', authenticationData, {
        observe: 'response',
      })
      .pipe(
        map((response) => {
          const authUser: LoggedUser | null = response.body;
          if (authUser) {
            this.loggedUserService.set(authUser, authenticationData.remember);
          }
          return response;
        })
      );
  }

  // Wylogowywanie.
  logout() {
    return this.http
      .get<any>(environment.serverUrl + 'auth/logout', {
        observe: 'response',
      })
      .pipe(
        map((response) => {
          if (response.status == 200) {
            this.loggedUserService.flush();
          }
          return response;
        })
      );
  }

  // Rejestracja.
  register(authenticationData: RegisterInterface): Observable<HttpResponse<LoggedUser>> {
    return this.http.post<LoggedUser>(environment.serverUrl + 'auth/register', authenticationData, {
      observe: 'response',
    });
  }

  // Potwierdzanie konta.
  confirmAccount(code: string): Observable<HttpResponse<any>> {
    return this.http.get<any>(environment.serverUrl + 'auth/confirm-account/' + code, {
      observe: 'response',
    });
  }

  // Proźba o zresetowanie hasła.
  sendResetPasswordEmail(authenticationData: PasswordResetInterface): Observable<HttpResponse<LoggedUser>> {
    return this.http.post<LoggedUser>(environment.serverUrl + 'auth/send-reset-password-email', authenticationData, {
      observe: 'response',
    });
  }

  // Resetowanie hasła.
  resetPassword(authenticationData: FinishResetPasswordInterface): Observable<HttpResponse<LoggedUser>> {
    return this.http.post<LoggedUser>(environment.serverUrl + 'auth/reset-password', authenticationData, {
      observe: 'response',
    });
  }
}
