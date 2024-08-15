import { Permission } from '../auth/permission';
import { BaseModel } from '../base-model';
import { Role } from '../role/role';

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
    if (data) {
      this.id = data.id || null;
      this.name = data.name || null;
      this.email = data.email || null;
      this.confirmed = data.confirmed || false;
      this.permissions = data.permissions ? JSON.parse(JSON.stringify(data.permissions)) : [];
      this.roles = data.roles || [];
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
