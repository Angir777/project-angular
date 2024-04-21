/**
 * Interfejsc określający "kształt" wymaganych danych podczas rejestracji.
 */
export interface RegisterInterface {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  acceptance_regulations: boolean;
}
