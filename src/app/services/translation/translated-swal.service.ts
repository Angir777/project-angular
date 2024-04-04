import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';

/**
 * Tłumaczone komunikaty SweetAlert2
 */
@Injectable({
  providedIn: 'root',
})
export class TranslatedSwalService {
  constructor(private translateService: TranslateService) {}

  async show(
    settings: SweetAlertOptions = {},
    translationParameters: any = {}
  ) {
    const translatedSettings = await this.prepareSettings(
      settings,
      translationParameters
    );
    swal.fire({ ...settings, ...translatedSettings });
  }

  async showAsync(
    settings: SweetAlertOptions = {},
    translationParameters: any = {}
  ): Promise<SweetAlertResult> {
    const translatedSettings = await this.prepareSettings(
      settings,
      translationParameters
    );
    return await swal.fire({ ...settings, ...translatedSettings });
  }

  private async prepareSettings(
    settings: SweetAlertOptions = {},
    translationParameters: any = {}
  ): Promise<SweetAlertOptions> {
    const translatedSettings: SweetAlertOptions = {};

    if (settings.title != null) {
      translatedSettings.title = this.translateService.instant(
        settings.title.toString(),
        translationParameters.title
      );
    }

    if (settings.text != null) {
      translatedSettings.text = this.translateService.instant(
        settings.text,
        translationParameters.text
      );
    }

    if (settings.footer != null) {
      translatedSettings.footer = this.translateService.instant(
        settings.footer.toString(),
        translationParameters.footer
      );
    }

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
