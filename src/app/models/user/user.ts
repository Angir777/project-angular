import { Permission } from '../auth/permission';
import { BaseModel } from '../base-model';
import { Role } from '../role/role';
import * as _ from 'lodash';

/**
 * Model użytkownika.
 */
export class User extends BaseModel {
  confirmed: boolean = false;
  email: string | null = null;
  name: string | null = null;

  permissions: Permission[] = [];
  roles: string[] = [];

  isRestoring?: boolean = false;

  constructor(data?: any) {
    super();
    if (!_.isNil(data?.permission)) {
      this.permissions = JSON.parse(JSON.stringify(data?.permissions));
    }
  }

  // Sprawdza, czy użytkownik ma przypisaną daną rolę.
  hasRole(role: Role | string): boolean {
    const roleName: string | null = role instanceof Role ? role.name : role;
    const index: number = this.roles.findIndex((name) => {
      return name === roleName;
    });
    return index >= 0;
  }
}
