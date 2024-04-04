import * as _ from "lodash";
import { Permission } from "../auth/permission";
import { BaseModel } from "../base-model";

/**
 * Role.
 */
export class Role extends BaseModel {
  name: string | null = null;
  guardName: string | null = null;
  permissions: Permission[] = [];

  permissionIds?: number[];
  isSelected?: boolean;

  constructor(data?: any) {
    super();
    this.fromJson(data);
    if (!_.isNil(data?.permission)) {
      this.permissions = JSON.parse(JSON.stringify(data?.permissions));
    }
  }

  /**
   * Sprawdza, czy rola ma przypisane dane uprawnienie
   * @param permission
   * @returns
   */
  hasPermission(permission: Permission): boolean {
    let index: number = this.permissions.findIndex((perm: Permission) => {
      return perm.id === permission.id;
    });
    return index >= 0;
  }
}
