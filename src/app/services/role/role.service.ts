import { Injectable } from '@angular/core';
import { BaseServiceWithDeleted } from '../base.service';
import { Role } from '../../models/role/role';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Permission } from '../../models/auth/permission';

@Injectable({
  providedIn: 'root',
})
export class RoleService extends BaseServiceWithDeleted<Role> {
  constructor(protected override http: HttpClient) {
    super(http, environment.serverUrl + 'role');
  }

  // Pobranie wszystkich uprawnień
  getPermissions(): Observable<HttpResponse<Permission[]>> {
    return this.http.get<Permission[]>(
      `${this.resourceUrl}/getPermissions`,
      {
        observe: 'response',
      }
    );
  }
}
