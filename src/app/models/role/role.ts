import { Permission } from '../auth/permission';
import { BaseModel } from '../base-model';
import * as _ from 'lodash';

/**
 * Model od ról.
 */
export class Role extends BaseModel {
  name: string | null = null;
  guardName: string | null = null;
  permissions: Permission[] = [];

  permissionIds?: number[];
  isSelected?: boolean = false;

  constructor(data?: any) {
    super();
    if (!_.isNil(data?.permission)) {
      this.permissions = JSON.parse(JSON.stringify(data?.permissions));
    }
  }

  // Sprawdza, czy rola ma przypisane dane uprawnienie.
  hasPermission(permission: Permission): boolean {
    const index: number = this.permissions.findIndex((perm: Permission) => {
      return perm.id === permission.id;
    });
    return index >= 0;
  }
}
