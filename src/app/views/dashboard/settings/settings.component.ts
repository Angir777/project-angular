import { Component } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';
import { FormControlErrorsComponent } from '../../../components/form-control-errors/form-control-errors.component';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RippleModule } from 'primeng/ripple';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router, RouterModule } from '@angular/router';
import { faKey, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { BaseFormComponent } from '../../../components/base-component';
import { TranslatedToastService } from '../../../services/translation/translated-toast.service';
import { TranslatedSwalService } from '../../../services/translation/translated-swal.service';
import { ChangePasswordInterface } from '../../../interfaces/change-password.interface';
import { SettingService } from '../../../services/setting/setting.service';
import { finalize } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    FontAwesomeModule,
    FormControlErrorsComponent,
    InputTextModule,
    ReactiveFormsModule,
    RippleModule,
    RouterModule,
    TabViewModule,
    TranslateModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent extends BaseFormComponent {
  faKey = faKey;
  faSpinner = faSpinner;

  isDeleting = false;

  constructor(
    private settingService: SettingService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private translatedToastService: TranslatedToastService,
    private translatedSwalService: TranslatedSwalService,
    private router: Router
  ) {
    super();

    // Funkcja walidująca do porównywania wartości pól password i passwordConfirmation
    const passwordMatchValidator = (control: AbstractControl): { [key: string]: boolean } | null => {
      const password = control.get('password');
      const passwordConfirmation = control.get('passwordConfirmation');

      // Sprawdź, czy pola istnieją i czy ich wartości są równe
      if (password && passwordConfirmation && password.value !== passwordConfirmation.value) {
        control.get('passwordConfirmation')?.setErrors({ passwordConfirmation: true });
        return { passwordConfirmation: true };
      }

      return null;
    };

    // Utworzenie formularza
    this.form = this.formBuilder.group(
      {
        oldPassword: [null, [Validators.required]],
        password: [null, [Validators.required, Validators.minLength(6), Validators.maxLength(191)]],
        passwordConfirmation: [null, [Validators.required]],
      },
      { validator: passwordMatchValidator }
    );
  }

  // Zmiana hasła przez użytkownika
  changePassword() {
    this.isLoading = true;

    const dataToSave: ChangePasswordInterface = {
      old_password: this.form.get('oldPassword')?.value,
      password: this.form.get('password')?.value,
      password_confirmation: this.form.get('passwordConfirmation')?.value,
    };

    this.settingService
      .changePassword(dataToSave)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response.body != null) {
            this.form.reset();
            this.translatedToastService.success('settings.success.changePasswordSuccessText');
          }
        },
        error: (error) => {
          // Obsługujemy błędy pól z API
          this.serverErrors = error.error != null && error.error.errors != null ? error.error.errors : [];
          // Obsługujemy pozostałe błędy
          if (error.error.error === 'WRONG_OLD_PASSWORD') {
            this.translatedToastService.error('settings.error.wrongOldPasswordText');
          } else {
            this.translatedToastService.error('settings.error.anotherErrorText');
          }
        },
        complete: () => {},
      });
  }

  // Usunięcie konta przez użytkownika
  async deleteAccount() {
    const result = await this.translatedSwalService.showAsync(
      {
        customClass: {
          container: 'swal-md',
        },
        icon: 'question',
        iconColor: '#ff3d41',
        title: 'settings.question.areYouShureToDeleteAccountText',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'global.button.yes',
        cancelButtonText: 'global.button.no',
      },
      {}
    );

    if (result.isConfirmed) {
      this.isDeleting = true;

      this.settingService
        .deleteAccount()
        .pipe(
          finalize(() => {
            this.isDeleting = false;
          })
        )
        .subscribe({
          next: (response) => {
            if (response.body != null) {
              this.form.reset();
              this.deletedSuccess();
            }
          },
          error: (error) => {
            // Obsługujemy błędy pól z API
            this.serverErrors = error.error != null && error.error.errors != null ? error.error.errors : [];
            // Obsługujemy pozostałe błędy
            if (error.error.error === 'CANT_DELETE_SUPER_ADMIN_ACCOUNT') {
              this.translatedToastService.error('settings.error.cantDeleteSuperAdminAccountText');
            } else {
              this.translatedToastService.error('settings.error.anotherDeleteErrorText');
            }
          },
          complete: () => {},
        });
    }
  }

  async deletedSuccess() {
    const result = await this.translatedSwalService.showAsync(
      {
        customClass: {
          container: 'swal-md',
        },
        icon: 'success',
        title: 'settings.success.deletedYourAccountTitle',
        text: 'settings.success.deletedYourAccountText',
        showConfirmButton: true,
        showCancelButton: false,
        confirmButtonText: 'global.button.ok',
      },
      {}
    );

    if (result) {
      this.logout();
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {},
    });
  }
}
