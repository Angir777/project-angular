import { Permission } from "./permission";

/**
 * Model grupy uprawnień.
 */
export class PermissionGroup {
  name: string | null = null;
  permissions: Permission[] = [];
}
