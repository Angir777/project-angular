/**
 * Interfejs określający "kształt" danych dla linku w menu.
 */
export interface MenuItem {
  label?: string;
  permissions?: string[];
  permissionsMode?: string;
  items?: MenuItem[];
  icon?: string;
  routerLink?: string[];
  separator?: string;
}
