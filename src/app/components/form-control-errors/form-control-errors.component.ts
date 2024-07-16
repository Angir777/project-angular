import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Komponent wyświetlający błędy walidacji dla ReactiveForms.
 */
@Component({
  selector: 'app-form-control-errors',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './form-control-errors.component.html',
  styleUrls: ['./form-control-errors.component.scss'],
})
export class FormControlErrorsComponent {
  /**
   * Obiekt zawierający błędy walidacji wyłapane po stronie przeglądarki.
   * Niektóre z opcji walidacji zwracają dodatkowo oczekiwaną i aktualną wartość.
   * Przykład dla walidatora required, gdy pole jest puste:
   * {
   *   required: true
   * }
   *
   * Przykład dla walidatora min, gdy wprowadzona wartość będzie mniejsza:
   * {
   *   min: {
   *     min: {{min}}, // wartość podana przy definiowaniu walidatora
   *     actual: {{max}} // wartość w polu
   *   }
   * }
   *
   * Klucze dla wartości oczekiwanej i aktualnej są różne w przypadku różnych walidatorów.
   */
  @Input() errors: any;

  /**
   * Obiekt zwracający błędy walidacji wyłapane po stronie API.
   * W przypadku Laravela błędy walidacji są zwracane w postaci:
   * {
   *   atrybut: [tablica string[] zawierająca przetłumaczone błędy walidacji, gotowe do wyświetlenia]
   * }
   *
   * Przykład dla pola o nazwie name, na którym sprawdzane jest required:
   * {
   *   name: ['Pole name jest wymagane']
   * }
   */
  @Input() serverErrors: string[] = [];

  /**
   * Tłumaczenie błędów, wyłapanych po stronie przeglądarki.
   * Przekazane tłumaczenia powinny być obiektem w postaci:
   * {
   *   validator: 'klucz do tłumaczenia'
   * }
   *
   * Przykład dla reguły required:
   * {
   *   required: 'user.validation.customRequiredMessage'
   * }
   *
   * Walidatory, które przyjmują parametr, np. min(1), zwracają ten parametr w przypadku błędu.
   * Parametr ten można użyć w kluczach tłumaczeń, np. 'user.validation.minAge': 'Minimalny wiek to {{min}}'.
   */
  @Input() customValidationMessages: any = {};

  constructor() {}

  /**
   * Funkcja sprawdza, czy dla danej reguły walidacji istnieje klucz tłumaczeń.
   * @param key Nazwa atrybutu
   */
  hasCustomErrorMessage(key: string): boolean {
    return !!this.customValidationMessages[key];
  }

  /**
   * Funkcja sprawdza, czy API zwróciło jakieś błędy.
   * @returns
   */
  hasServerErrors(): boolean {
    return !(this.serverErrors == null || this.serverErrors.length === 0);
  }
}
