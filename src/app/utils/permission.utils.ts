/**
 * Sprawdzenie czy użytkownik posiada podane uprawnienie.
 */
export const hasPermission = (
  permissionToCheck: string,
  userPermissions: string[]
): boolean => {
  return userPermissions.includes(permissionToCheck);
};
