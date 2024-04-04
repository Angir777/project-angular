import * as _ from "lodash";
import { Permission } from "../auth/permission";
import { BaseModel } from "../base-model";
import { Role } from "../role/role";

/**
 * Główny model użytkownika.
 */
export class User extends BaseModel {
  confirmed: boolean = false;
  email: string | null = null;
  name: string | null = null;

  permissions: Permission[] = [];
  roles: string[] = [];

  isRestoring?: boolean;

  constructor(data?: any) {
    super();
    this.fromJson(data);
    if (!_.isNil(data?.permission)) {
      this.permissions = JSON.parse(JSON.stringify(data?.permissions));
    }
  }

  // Sprawdza, czy użytkownik ma przypisaną daną rolę
  hasRole(role: Role | string): boolean {
    let roleName: string | null = role instanceof Role ? role.name : role;
    let index: number = this.roles.findIndex((name) => {
      return name === roleName;
    });
    return index >= 0;
  }
}
