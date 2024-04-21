/**
 * Interfejsc określający "kształt" wymaganych danych podczas dokończania resetowania hasła.
 */
export interface FinishResetPasswordInterface {
  email: string;
  password: string;
  password_confirmation: string;
  token: string;
}
