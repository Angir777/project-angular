import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

/**
 * Tłumaczone komunikaty SweetAlert2.
 */
@Injectable({
  providedIn: 'root',
})
export class TranslatedSwalService {

  // Użycie:
  // async exampleFunction() {
  //   const result = await this.translatedSwalService.showAsync(
  //     {
  //       icon: 'question',
  //       title: 'login.form.password',
  //       text: 'login.form.dupa',
  //       footer: 'login.form.remember',
  //       showConfirmButton: true,
  //       showCancelButton: true,
  //       confirmButtonText: 'global.button.yes',
  //       cancelButtonText: 'global.button.no',

  //       input: 'textarea',
  //       inputPlaceholder: this.translateService.instant('validation.sweetAlertCommentIsRequired'),
  //       inputAttributes: {
  //         'aria-label': 'comment'
  //       },
  //       inputValidator: (value) => {
  //         if (value && value.length < 5) {
  //           return this.translateService.instant('validation.sweetAlertCommentMinLength')
  //         } else if (!value) {
  //           return this.translateService.instant('validation.sweetAlertCommentIsRequired')
  //         }
  //       }
  //     },
  //     {
  //       zmienna: "ha ha",
  //     }
  //   );
  // }

  constructor(
    private translateService: TranslateService
  ) { }

  // Synchroniczne wywołanie.
  async show(
    settings: SweetAlertOptions = {},
    translationParameters: any = {}
  ) {
    const translatedSettings = await this.prepareSettings(
      settings,
      translationParameters
    );
    
    Swal.fire({ ...translatedSettings });
  }

  // Asynchroniczne wywołanie.
  async showAsync(
    settings: SweetAlertOptions = {},
    translationParameters: any = {}
  ): Promise<SweetAlertResult> {
    const translatedSettings = await this.prepareSettings(
      settings,
      translationParameters
    );

    return await Swal.fire({ ...translatedSettings });
  }

  // Przygotowanie tłumaczeń.
  private async prepareSettings(
    settings: SweetAlertOptions = {},
    translationParameters: any = {}
  ): Promise<SweetAlertOptions> {
    const translatedSettings: SweetAlertOptions = { ...settings };

    // Tytuł.
    if (settings.title != null) {
      translatedSettings.title = this.translateService.instant(
        settings.title.toString(),
        translationParameters.title
      );
    }

    // Zmienne.
    if (settings.text != null) {
      translatedSettings.text = this.translateService.instant(
        settings.text,
        translationParameters
      );
    }

    // Stopka.
    if (settings.footer != null) {
      translatedSettings.footer = this.translateService.instant(
        settings.footer.toString(),
        translationParameters.footer
      );
    }

    // Przycisk potwierdzenia.
    if (
      settings.confirmButtonText != null &&
      settings.confirmButtonText.length > 0
    ) {
      translatedSettings.showConfirmButton = true;
      translatedSettings.confirmButtonText = this.translateService.instant(
        settings.confirmButtonText,
        translationParameters.confirmButtonText
      );
    }

    // Przycisk odrzucenia.
    if (
      settings.cancelButtonText != null &&
      settings.cancelButtonText.length > 0
    ) {
      translatedSettings.showCancelButton = true;
      translatedSettings.cancelButtonText = this.translateService.instant(
        settings.cancelButtonText,
        translationParameters.cancelButtonText
      );
    }

    return translatedSettings;
  }
  
}
