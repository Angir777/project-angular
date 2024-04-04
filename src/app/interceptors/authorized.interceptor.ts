import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { LoggedUserService } from '../services/logged-user/logged-user.service';


/**
 * Interceptor przychwytujący błędy 401 dla zalogowanego użytkownika.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthorizedInterceptor implements HttpInterceptor {

  constructor(
    private loggedUserService: LoggedUserService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Jeśli jest niezalogowany to przepuszczamy dalej.
    if (!this.loggedUserService.isAuthenticated()) {
      return next.handle(request);
    }
    // Jeśli jest zalogowany, a zapytanie zwróci błąd 401.
    // (To jest dla sytuacji, gdy passport key się zmieni)
    return next.handle(request).pipe(
      catchError((error: any) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            // Wylogowanie z aplikacji.
            this.loggedUserService.flush();
            // Przekierowanie na stronę logowania.
            this.router.navigate(['/login']);
          }
        }
        throw error;
      })
    );
  }

}
