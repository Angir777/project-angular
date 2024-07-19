import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ChangePasswordInterface } from '../../interfaces/change-password.interface';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SettingService {
  constructor(private http: HttpClient) {}

  // Zmiana hasła przez użytkownika
  changePassword(context: ChangePasswordInterface): Observable<HttpResponse<ChangePasswordInterface>> {
    const body = {
      oldPassword: context.old_password,
      password: context.password,
      password_confirmation: context.password_confirmation,
    };
    return this.http.patch<ChangePasswordInterface>(environment.serverUrl + 'account/change-password', body, {
      observe: 'response',
    });
  }

  // Usunięcie konta przez użytkownika
  deleteAccount(): Observable<HttpResponse<any>> {
    return this.http.delete<any>(environment.serverUrl + 'account/dalete-account', {
      observe: 'response',
    });
  }
}
