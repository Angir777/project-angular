import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoggedUserService } from '../services/logged-user/logged-user.service';

/**
 * Interceptor dodający token do zapytań wysyłanych przez zalogowanego użytkownika do API.
 * Token musi lecieć, jeśli w API mamy chronione rutingi.
 */
@Injectable({
  providedIn: 'root',
})
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private loggedUserService: LoggedUserService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.loggedUserService.getToken() !== null) {
      request = request.clone({
        setHeaders: {
          Authorization: `${this.loggedUserService.getTokenHeader()}`,
        },
      });
    }
    return next.handle(request);
  }

}
