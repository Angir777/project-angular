import { AbstractControl, FormGroup } from "@angular/forms";
import * as _ from "lodash";
import { ServerSideFormValidationInterface } from "../interfaces/server-side-form-validation.interface";
import { getServerErrors, getValidationClass, getValidationStatus, isFormControlInvalid } from "../utils/form.utils";

/**
 * Bazowa klasa komponentu.
 */
export abstract class BaseComponent {

  isLoading: boolean = false;
  isSaving: boolean = false;

  /**
   * Przeniesienie do poprzedniego widoku/routingu.
   */
  previousState(): void {
    window.history.back();
  }
}

export abstract class BaseFormComponent extends BaseComponent implements ServerSideFormValidationInterface {

  form!: FormGroup;
  serverErrors: any;
  error: string = '';

  isFormControlInvalid(
    formControlName: string,
    serverValidationPropName?: string
  ): boolean {
    const abstractControl: AbstractControl | null = this.form.get(formControlName);

    // Jeśli nie podano drugiego argumentu, to jego nazwa jest identyczna z pierwszym.
    if (_.isNil(serverValidationPropName)) {
      serverValidationPropName = formControlName;
    }

    // Sprawdzenie, czy dla pola są błędy zwrócone z API.
    if (
      !_.isNil(this.serverErrors) &&
      _.has(this.serverErrors, serverValidationPropName) &&
      this.serverErrors[serverValidationPropName].length > 0
    ) {
      return true;
    }

    // sprawdzenie, czy dla pola wykryto błędy po stronie przeglądarki.
    if (abstractControl !== null) {
      return isFormControlInvalid(abstractControl);
    }
    return false;
  }

  getFormValidationStatus(
    formControlName: string,
    serverValidationPropName?: string
  ): any {
    const abstractControl: AbstractControl | null = this.form.get(formControlName);

    if (abstractControl === null) {
      return '';
    }

    if (!abstractControl.touched && !abstractControl.dirty) {
      return 'basic';
    }

    return getValidationStatus(
      this.isFormControlInvalid(formControlName, serverValidationPropName)
    );
  }

  getFormValidationClass(
    formControlName: string,
    serverValidationPropName?: string
  ): string {
    const abstractControl: AbstractControl | null = this.form.get(formControlName);

    if (abstractControl === null) {
      return '';
    }

    if (!abstractControl.touched && !abstractControl.dirty) {
      return '';
    }

    // Jeśli nie podano drugiego argumentu, to jego nazwa jest identyczna z pierwszym.
    if (_.isNil(serverValidationPropName)) {
      serverValidationPropName = formControlName;
    }

    return getValidationClass(
      this.isFormControlInvalid(formControlName, serverValidationPropName)
    );
  }

  getServerErrors(serverValidationPropName: string): string[] {
    return getServerErrors(this.serverErrors, serverValidationPropName);
  }

  clearServerErrors(serverValidationPropName: string): void {
    if (_.has(this.serverErrors, serverValidationPropName)) {
      delete this.serverErrors.serverValidationPropName;
    }
  }

  getAriaInvalid(formControlName: string): any {
    const abstractControl: AbstractControl | null = this.form.get(formControlName);

    if (abstractControl === null) {
      return null;
    }

    return abstractControl.invalid && abstractControl.touched ? true : null;
  }

  // Ustawia styl dla formularzy
  getStatus(formControlName: string): string {

    const status = this.getFormValidationStatus(formControlName);

    if (status == 'success') {
      return 'ng-valid-success';
    } else if (status == 'danger') {
      return 'ng-invalid ng-dirty';
    }

    return '';

  }
}
