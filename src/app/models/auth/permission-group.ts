import { Permission } from "./permission";

export class PermissionGroup {
  name: string | null = null;
  permissions: Permission[] = [];
}
