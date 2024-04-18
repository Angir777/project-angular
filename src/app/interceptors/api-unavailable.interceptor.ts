import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';

/**
 * Interceptor przechwytujący brak połączenia z API.
 */
@Injectable({
  providedIn: 'root'
})
export class ApiUnavailableInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(request)
      .pipe(catchError((error: HttpErrorResponse) => this.errorHandler(error)));
  }

  private errorHandler(error: HttpErrorResponse): Observable<HttpEvent<any>> {
    if (error.status <= 0) {
      // Informacja, że nie ma połączenia z API.
      console.error("NO_CONNECTION_TO_API");
    }
    throw error;
  }

}
