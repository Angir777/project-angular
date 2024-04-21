/**
 * Interfejsc określający "kształt" wymaganych danych podczas resetowania hasła.
 */
export interface PasswordResetInterface {
  email: string;
  gatewayUrl?: string;
}
