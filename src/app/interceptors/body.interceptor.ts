import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

/**
 * Interceptor dokładający do body parametry.
 * (Uwaga! Body nie jest wysyłane podczas zapytań GET)
 */
@Injectable({
  providedIn: 'root'
})
export class BodyInterceptor implements HttpInterceptor {

  constructor(
    private translateService: TranslateService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.body instanceof FormData) {
      // Dorzuca do requesta aktualnie wybrany język z APP
      request.body.append('locale', this.translateService.currentLang);
      return next.handle(request);
    } else {
      return next.handle(
        request.clone({
          body: {
            ...request.body,
            locale: this.translateService.currentLang,
          },
        })
      );
    }
  }

}
