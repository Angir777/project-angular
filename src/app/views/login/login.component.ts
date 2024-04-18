import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseFormComponent } from '../../components/base-component';
import { LoggedUserService } from '../../services/logged-user/logged-user.service';
import { environment } from '../../../environments/environment';
import { LoggedUser } from '../../models/auth/logged-user.model';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormControlErrorsComponent } from '../../components/form-control-errors/form-control-errors.component';
import { RippleModule } from 'primeng/ripple';
import { TranslatedToastService } from '../../services/translation/translated-toast.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faKey, faSpinner, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormControlErrorsComponent,
    ReactiveFormsModule,
    InputTextModule,
    CheckboxModule,
    ButtonModule,
    CommonModule,
    TranslateModule,
    RippleModule,
    FontAwesomeModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent extends BaseFormComponent implements OnInit {

  public loggedUser: LoggedUser | null = null;
  appVersion: string = environment.APP_VERSION;

  faUser = faUser;
  faKey = faKey;
  faSpinner = faSpinner

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

    // Wstawienie przykładowych danych na dev
    this.form = this.formBuilder.group({
      email: [
        environment.production ? '' : 'superadmin@mail.com',
        [Validators.required, Validators.email],
      ],
      password: [
        environment.production ? '' : 'root12',
        [Validators.required]
      ],
      remember: true,
    });
  }

  ngOnInit(): void { }

  login() {
    this.isLoading = true;
    this.authService
      .login(this.form.value)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          this.loggedUser = response.body;
          if (this.loggedUser !== null) {
            this.form.reset();
            this.router.navigate(["home"]);
          }
        },
        error: (error) => {
          if (error.error.error === 'INVALID_CREDENTIALS') {
            this.translatedToastService.error('login.errors.wrongEmailOrPassword');
          } else {
            this.translatedToastService.error('login.errors.anotherError');
          }
        },
        complete: () => { },
      });
  }

}
