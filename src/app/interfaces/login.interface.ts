/**
 * Interfejs określający "kształt" wymaganych danych podczas logowania.
 */
export interface LoginInterface {
  email: string;
  password: string;
  remember: boolean;
}
