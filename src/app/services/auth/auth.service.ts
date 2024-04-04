import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { LoggedUserService } from '../logged-user/logged-user.service';
import { LoginInterface } from '../../interfaces/login.interface';
import { LoggedUser } from '../../models/auth/logged-user.model';
import { environment } from '../../../environments/environment.dev';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient, 
    private loggedUserService: LoggedUserService
  ) {}

  login(authenticationData: LoginInterface): Observable<HttpResponse<LoggedUser>> {
    return this.http
      .post<LoggedUser>(environment.serverUrl + 'auth/login', authenticationData, {
        observe: 'response',
      })
      .pipe(
        map((response) => {
          let authUser: LoggedUser | null = response.body;
          if (authUser) {
            this.loggedUserService.set(authUser, authenticationData.remember);
          }
          return response;
        })
      );
  }

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

  register(authenticationData: LoginInterface): Observable<HttpResponse<LoggedUser>> {
    return this.http
      .post<LoggedUser>(environment.serverUrl + 'auth/register', authenticationData, {
        observe: 'response',
      });
  }

  confirmAccount(code: string): Observable<HttpResponse<any>> {
    return this.http
      .get<any>(environment.serverUrl + 'auth/confirm-account/' + code, {
        observe: 'response',
      })
  }
}
