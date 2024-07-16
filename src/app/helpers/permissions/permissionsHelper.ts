import { PermissionModes } from '../../constants/permission-modes.const';

/**
 * Weryfikacja uprawnień
 */
export abstract class PermissionsHelper {
  public static checkPermission(itemPermissions: string[] | undefined, userPermissions: string[], permissionMode: string | undefined): boolean {
    if (itemPermissions == null || itemPermissions.length < 1) {
      return true;
    }

    switch (permissionMode) {
      case PermissionModes.AT_LEAST_ONE: {
        return itemPermissions.some((ai) => userPermissions.includes(ai));
      }

      case PermissionModes.ALL: {
        return itemPermissions.every((ai) => userPermissions.includes(ai));
      }

      case PermissionModes.EXCEPT_AT_LEAST_ONE: {
        return !itemPermissions.some((ai) => userPermissions.includes(ai));
      }

      case PermissionModes.EXCEPT_ALL: {
        return !itemPermissions.every((ai) => userPermissions.includes(ai));
      }

      default: {
        return false;
      }
    }
  }
}
