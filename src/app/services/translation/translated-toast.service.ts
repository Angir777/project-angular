import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';

export interface TranslationParameters  {
  [key: string]: string | number | boolean
}

/**
 * Tłumaczone komunikaty toast.
 */
@Injectable({
  providedIn: 'root',
})
export class TranslatedToastService {
  // Użycie:
  // this.translatedToastService.error('messageTranslation', {var1: "t1", var2:"t2"}, 'titleTranslation');

  // Informacja, gdy nie podano tłumaczenia
  messageNotFound = 'MESSAGE_NOT_FOUND';

  constructor(
    private messageService: MessageService,
    private translateService: TranslateService
  ) {}

  // Przygotowanie tłumaczenia wiadomości.
  private prepareMessage(message?: string, translationParameters: TranslationParameters = {}): string | undefined {
    if (message != null) {
      return this.translateService.instant(message, translationParameters);
    }
    return message;
  }

  // Przygotowanie tłumaczenia tytułu.
  private prepareTitle(title?: string, translationParameters: TranslationParameters = {}): string | undefined {
    if (title != null) {
      return this.translateService.instant(title, translationParameters);
    }
    return title;
  }

  // Success toast.
  success(message?: string, translationParameters: TranslationParameters = {}, title?: string) {
    const successMessage = message ? this.prepareMessage(message, translationParameters) : this.messageNotFound;
    const prepareTitle = title ? this.prepareTitle(title, translationParameters) : this.translateService.instant('global.toast.defaultTitle.success');
    this.messageService.add({
      severity: 'success',
      summary: prepareTitle,
      detail: successMessage,
    });
  }

  // Info toast.
  info(message?: string, translationParameters: TranslationParameters = {}, title?: string) {
    const infoMessage = message ? this.prepareMessage(message, translationParameters) : this.messageNotFound;
    const prepareTitle = title ? this.prepareTitle(title, translationParameters) : this.translateService.instant('global.toast.defaultTitle.info');
    this.messageService.add({
      severity: 'info',
      summary: prepareTitle,
      detail: infoMessage,
    });
  }

  // Warning toast.
  warning(message?: string, translationParameters: TranslationParameters = {}, title?: string) {
    const warnMessage = message ? this.prepareMessage(message, translationParameters) : this.messageNotFound;
    const prepareTitle = title ? this.prepareTitle(title, translationParameters) : this.translateService.instant('global.toast.defaultTitle.warn');
    this.messageService.add({
      severity: 'warn',
      summary: prepareTitle,
      detail: warnMessage,
    });
  }

  // Error toast.
  error(message?: string, translationParameters: TranslationParameters = {}, title?: string) {
    const errorMessage = message ? this.prepareMessage(message, translationParameters) : this.messageNotFound;
    const prepareTitle = title ? this.prepareTitle(title, translationParameters) : this.translateService.instant('global.toast.defaultTitle.error');
    this.messageService.add({
      severity: 'error',
      summary: prepareTitle,
      detail: errorMessage,
    });
  }
}
