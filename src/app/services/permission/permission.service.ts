import { Injectable } from '@angular/core';
import { BaseServiceWithDeleted } from '../base.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Permission } from '../../models/auth/permission';
import { PermissionGroup } from '../../models/auth/permission-group';

@Injectable({
  providedIn: 'root',
})
export class PermissionService extends BaseServiceWithDeleted<Permission> {
  constructor(protected override http: HttpClient) {
    super(http, environment.serverUrl + 'permission');
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

  /**
   * Grupuje uprawnienia posiadające przypisaną grupę wg. grup uprawnień.
   *
   * @param permissions
   * @returns
   */
  groupPermissions(permissions: Permission[]): PermissionGroup[] {
    // Utwórz mapę do grupowania uprawnień
  const permissionGroupsMap = new Map<string, PermissionGroup>();

  permissions.forEach((permission) => {
    // Uzyskaj nazwę grupy z permissionGroupName
    const groupName = permission.permissionGroupName;

    if (groupName) {
      // Sprawdź, czy grupa już istnieje w mapie
      let permissionGroup = permissionGroupsMap.get(groupName);

      if (!permissionGroup) {
        // Jeśli grupa nie istnieje, utwórz nową
        permissionGroup = {
          name: groupName,
          permissions: [permission],
        };
        permissionGroupsMap.set(groupName, permissionGroup);
      } else {
        // Jeśli grupa istnieje, dodaj uprawnienie do grupy
        permissionGroup.permissions.push(permission);
      }
    }
  });

  // Konwertuj mapę na tablicę i zwróć
  return Array.from(permissionGroupsMap.values());
  }
}
