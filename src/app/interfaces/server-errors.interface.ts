/**
 * Interfejs określający "kształt" wymaganych danych dla błędów serwera.
 */
export interface ServerErrors {
  [key: string]: string[];
}
