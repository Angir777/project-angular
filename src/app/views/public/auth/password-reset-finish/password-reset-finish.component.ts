import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../services/auth/auth.service';
import { LoggedUserService } from '../../../../services/logged-user/logged-user.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslatedToastService } from '../../../../services/translation/translated-toast.service';
import _ from 'lodash';
import { FormControlErrorsComponent } from '../../../../components/form-control-errors/form-control-errors.component';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RippleModule } from 'primeng/ripple';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AutoFocusModule } from 'primeng/autofocus';
import { BaseFormComponent } from '../../../../components/base-component';
import { FinishResetPasswordInterface } from '../../../../interfaces/finish-reset-password.interface';
import { faKey, faSpinner, faUser } from '@fortawesome/free-solid-svg-icons';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-new-password',
  standalone: true,
  imports: [
    FormControlErrorsComponent,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    CommonModule,
    TranslateModule,
    RippleModule,
    FontAwesomeModule,
    RouterModule,
    AutoFocusModule
  ],
  templateUrl: './password-reset-finish.component.html',
  styleUrl: './password-reset-finish.component.scss'
})
export class PasswordResetFinishComponent extends BaseFormComponent implements OnInit {

  faUser = faUser;
  faKey = faKey;
  faSpinner = faSpinner

  code!: string;

  constructor(
    private authService: AuthService,
    private loggedUserService: LoggedUserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private translatedToastService: TranslatedToastService
  ) {
    super();

    // Jeśli user jest zalogowany to przekierowywujemy go na stronę domową
    if (this.loggedUserService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }

    // Funkcja walidująca do porównywania wartości pól password i passwordConfirmation
    const passwordMatchValidator = (control: AbstractControl): { [key: string]: boolean } | null => {
      const password = control.get('password');
      const passwordConfirmation = control.get('passwordConfirmation');

      // Sprawdź, czy pola istnieją i czy ich wartości są równe
      if (password && passwordConfirmation && password.value !== passwordConfirmation.value) {
        control.get('passwordConfirmation')?.setErrors({ 'passwordConfirmation': true });
        return { 'passwordConfirmation': true };
      }

      return null;
    };

    // Utworzenie formularza
    this.form = this.formBuilder.group({
      email: [
        null,
        [Validators.required, Validators.email],
      ],
      password: [
        null,
        [Validators.required, Validators.minLength(6), Validators.maxLength(191)]
      ],
      passwordConfirmation: [
        null,
        [Validators.required]
      ],
    }, { validator: passwordMatchValidator});
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      if (!_.isNil(params['code'])) {
        this.code = params['code'];
      } else {
        this.router.navigate(["login"]);
      }
    });
  }

  finishResetPassword() {
    this.isLoading = true;

    const dataToSave: FinishResetPasswordInterface = {
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value,
      password_confirmation: this.form.get('passwordConfirmation')?.value,
      token: this.code
    };

    this.authService
      .resetPassword(dataToSave)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (!_.isNil(response.body)) {
            this.translatedToastService.success('passwordResetFinish.success.passwordResetSuccessText');
            this.form.reset();
            this.router.navigate(["login"]);
          }
        },
        error: (error) => {
          // Obsługujemy błędy pól z API
          this.serverErrors = !_.isNil(error.error) && !_.isNil(error.error.errors) ? error.error.errors : [];
          // Obsługujemy pozostałe błędy
          if (error.error.error === 'TOKEN_INVALID') {
            this.translatedToastService.error('passwordResetFinish.error.tokenInvalidText');
          } else if (error.error.error === 'TOKEN_EXPIRED') {
            this.translatedToastService.error('passwordResetFinish.error.tokenExpiredText');
          } else if (error.error.error === 'USER_NOT_FOUND') {
            this.translatedToastService.error('passwordResetFinish.error.userNotFoundText');
          } else {
            this.translatedToastService.error('passwordResetFinish.error.anotherErrorText');
          }
        },
        complete: () => { },
      });
  }

}
