import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiUnavailableInterceptor } from './api-unavailable.interceptor';
import { TokenInterceptor } from './token.interceptor';
import { BodyInterceptor } from './body.interceptor';
import { AuthorizedInterceptor } from './authorized.interceptor';
import { ErrorHandlerInterceptor } from './error-handler.interceptor';

/**
 * Lista interceptorów HTTP ładowanych w aplikacji.
 */
export const httpInterceptorProviders = [
  // Interceptor przechwytujący brak połączenia z API.
  { provide: HTTP_INTERCEPTORS, useClass: ApiUnavailableInterceptor, multi: true },

  // Interceptor dodający token do zapytań wysyłanych przez zalogowanego użytkownika do API.
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },

  // Interceptor dokładający do body parametry.
  { provide: HTTP_INTERCEPTORS, useClass: BodyInterceptor, multi: true },

  // Interceptor przychwytujący błędy 401 dla zalogowanego użytkownika.
  { provide: HTTP_INTERCEPTORS, useClass: AuthorizedInterceptor, multi: true },

  // Interceptor przechwytujący błędy zapytań.
  { provide: HTTP_INTERCEPTORS, useClass: ErrorHandlerInterceptor, multi: true },
];
