import { BaseModel } from '../base-model';
import { PermissionGroup } from './permission-group';

export class Permission extends BaseModel {
  name: string | null = null;
  permissionGroup: PermissionGroup | null = null;

  isSelected?: boolean;
}
