import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '../../../../components/base-component';
import { AuthService } from '../../../../services/auth/auth.service';
import { LoggedUserService } from '../../../../services/logged-user/logged-user.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { FormControlErrorsComponent } from '../../../../components/form-control-errors/form-control-errors.component';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RippleModule } from 'primeng/ripple';
import { TranslateModule } from '@ngx-translate/core';
import { faSpinner, faUser } from '@fortawesome/free-solid-svg-icons';
import { finalize } from 'rxjs';
import _ from 'lodash';
import { TranslatedToastService } from '../../../../services/translation/translated-toast.service';
import { AutoFocusModule } from 'primeng/autofocus';

@Component({
  selector: 'app-password-reset',
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
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss'
})
export class PasswordResetComponent extends BaseFormComponent implements OnInit {

  faUser = faUser;
  faSpinner = faSpinner;

  constructor(
    private authService: AuthService,
    private loggedUserService: LoggedUserService,
    private formBuilder: FormBuilder,
    private router: Router,
    private translatedToastService: TranslatedToastService,
  ) {
    super();

    // Jeśli user jest zalogowany to przekierowywujemy go na stronę domową
    if (this.loggedUserService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }

    // Utworzenie formularza
    this.form = this.formBuilder.group({
      email: [
        null,
        [Validators.required, Validators.email],
      ]
    });
  }

  ngOnInit(): void { }

  passwordReset() {
    this.isLoading = true;
    this.authService
      .sendResetPasswordEmail(this.form.value)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (!_.isNil(response.body)) {
            this.translatedToastService.success('passwordReset.success.passwordResetSuccessText');
            this.form.reset();
          }
        },
        error: (error) => {
          // Obsługujemy błędy pól z API
          this.serverErrors = !_.isNil(error.error) && !_.isNil(error.error.errors) ? error.error.errors : [];
          // Obsługujemy pozostałe błędy
          if (error.error.error === 'USER_NOT_FOUND') {
            this.translatedToastService.error('passwordReset.error.userNotFoundText');
          } else if (error.error.error === 'TOKEN_EXISTS') {
            this.translatedToastService.warning('passwordReset.warning.tokenExistsText');
          } else {
            this.translatedToastService.error('passwordReset.error.anotherErrorText');
          }
        },
        complete: () => { },
      });
  }

}
