import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.dev';
import { User } from '../../models/user/user';
import { BaseServiceWithDeleted } from '../base.service';

@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseServiceWithDeleted<User> {
  constructor(protected override http: HttpClient) {
    super(http, environment.serverUrl + 'user');
  }

   // Przywrócenie użytkownika.
   restore(id: number): Observable<HttpResponse<User>> {
    return this.http.post<User>(
      `${this.resourceUrl}/${id}/restore`,
      {},
      { observe: 'response' }
    );
  }
}
