/**
 * Interfejs określający "kształt" wymaganych danych podczas zmiany hasła.
 */
export interface ChangePasswordInterface {
  old_password: string;
  password: string;
  password_confirmation: string;
}
