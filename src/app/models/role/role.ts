import { Permission } from '../auth/permission';
import { BaseModel } from '../base-model';

/**
 * Model od ról.
 */
export class Role extends BaseModel {
  name: string | null = null;
  guardName: string | null = null;
  permissions: Permission[] = [];
  permissionIds?: number[];

  constructor(data?: any) {
    super();
    if (data) {
      this.id = data.id || null;
      this.name = data.name || null;
      this.guardName = data.guardName || null;
      this.permissions = data.permissions ? JSON.parse(JSON.stringify(data.permissions)) : [];
      this.permissionIds = data.permissionIds || [];
    }
  }

  // Sprawdza, czy rola ma przypisane dane uprawnienie.
  hasPermission(permission: Permission): boolean {
    const index: number = this.permissions.findIndex((perm: Permission) => perm.id === permission.id);
    return index >= 0;
  }
}
