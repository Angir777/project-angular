/**
 * Interfejs walidacji formularza po stronie API.
 */
export interface ServerSideFormValidationInterface {
  /**
   * Sprawdzenie czy pole zostało wypełnione niepoprawnie.
   *
   * Parametr serverValidationPropName jest wymagany, ponieważ dwuczłonowe
   * nazwy po stronie Angulara są zapisywane w formie userName, po stronie API w formie user_name.
   * 
   * @param formControlName nazwa pola input
   * @param serverValidationPropName nazwa atrybutu walidowanego po stronie API
   */
  isFormControlInvalid(
    formControlName: string,
    serverValidationPropName?: string
  ): boolean;

  /**
   * Funkcja zwraca klasę walidacji ('is-valid' | 'is-invalid')
   * w zależności od poprawności walidowanego pola,
   * jeśli użytkownik wchodzi w interakcję lub opuścił pole.
   * 
   * Parametr serverValidationPropName jest wymagany, ponieważ dwuczłonowe
   * nazwy po stronie Angulara są zapisywane w formie userName, po stronie API w formie user_name.
   * 
   * @param formControlName nazwa pola input
   * @param serverValidationPropName nazwa atrybutu walidowanego po stronie API
   */
  getFormValidationClass(
    formControlName: string,
    serverValidationPropName?: string
  ): string;

  /**
   * Funkcja zwraca błędy walidacji dla wybranego pola zwrócone przez API lub pustą tablice w przypadku ich braku.
   * 
   * @param serverValidationPropName nazwa atrybutu walidowanego po stronie API
   */
  getServerErrors(serverValidationPropName: string): string[];

  /**
   * Funkcja czyści błędy walidacji zwrócone przez API dla wybranego pola.
   * 
   * @param serverValidationPropName nazwa atrybutu walidowanego po stronie API
   */
  clearServerErrors(serverValidationPropName: string): void;
}
