import { ElementRef } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import * as _ from 'lodash';

/**
 * Funkcja wymusza walidacje na wszystkich polach z formularza.
 * Działa także w przypadku nested forms.
 *
 * @param formGroup formularz
 */
export const validateAllFormFields = (formGroup: FormGroup): void => {
  Object.keys(formGroup.controls).forEach((field: any) => {
    const control = formGroup.get(field);
    if (control instanceof FormControl) {
      control.markAsTouched({ onlySelf: true });
    } else if (control instanceof FormGroup) {
      validateAllFormFields(control);
    }
  });
};

/**
 * Funkcja sprawdza czy element formularza jest wypełniony poprawnie.
 *
 * @param formControl formControl
 */
export const isFormControlInvalid = (formControl: AbstractControl): boolean => {
  return formControl!.invalid && (formControl!.dirty || formControl!.touched);
};

/**
 * Funkcja zwraca klasę css odnośnie do walidacji pola.
 *
 * @param isInvalid
 */
export const getValidationClass = (isInvalid: boolean): string => {
  if (!isInvalid) {
    return 'is-valid';
  }

  return 'is-invalid';
};

/**
 * Funkcja zwraca błędy zwrócone przez serwer.
 *
 * @param serverErrors
 * @param propName
 */
export const getServerErrors = (serverErrors: any, propName: string): string[] => {
  if (_.has(serverErrors, propName)) {
    return serverErrors[propName];
  }

  return [];
};

/**
 * Status walidacji.
 *
 * @param isInvalid
 */
export const getValidationStatus = (isInvalid: boolean): string => {
  if (!isInvalid) {
    return 'success';
  }

  return 'danger';
};

/**
 * Funkcja ustawia focus na invalid field,
 * lub scroluje do danego pola, jeżeli nie można ustawić na nim focus.
 *
 * @param form
 * @param el
 */
export const focusInvalidInput = (form: FormGroup, el: ElementRef): void => {
  for (const key of Object.keys(form.controls)) {
    if (form.controls[key].invalid) {
      const control = form.controls[key];

      // Sprawdzenie, czy pojedyncza kontrolka, czy grupa.
      if (control instanceof FormControl) {
        // Wyszukuje w DOM, elementu na podstawie formControlName.
        const invalidControl = el.nativeElement.querySelector('[formcontrolname="' + key + '"]');

        if (invalidControl !== null) {
          // Jeżeli input, ustawiamy focus, jeżeli nie scroll do elementu.
          if (invalidControl.nodeName.toLowerCase() === 'input') {
            invalidControl.focus();
          } else {
            invalidControl.scrollIntoView({
              block: 'center',
              inline: 'center',
            });
          }
        }

        break;
      } else if (control instanceof FormGroup) {
        focusInvalidInput(control, el);
      }
    }
  }
};
