import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { AbstractControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BaseFormComponent } from '../../components/base-component';
import { LoggedUserService } from '../../services/logged-user/logged-user.service';
import { environment } from '../../../environments/environment';
import { LoggedUser } from '../../models/auth/logged-user.model';
import { Router, RouterModule } from '@angular/router';
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
import { faKey, faSignature, faSpinner, faUser } from '@fortawesome/free-solid-svg-icons';
import { RegisterInterface } from '../../interfaces/register.interface';

@Component({
  selector: 'app-register',
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
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent extends BaseFormComponent implements OnInit {

  faSignature = faSignature;
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

    // Funkcja walidująca do porównywania wartości pól password i passwordConfirmation
    const passwordMatchValidator = (control: AbstractControl): {[key: string]: boolean} | null => {
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
      name: [
        null,
        [Validators.required, Validators.maxLength(191)],
      ],
      email: [
        null,
        [Validators.required, Validators.email, Validators.maxLength(191)],
      ],
      password: [
        null,
        [Validators.required, Validators.minLength(6), Validators.maxLength(191)]
      ],
      passwordConfirmation: [
        null,
        [Validators.required]
      ],
    }, { validator: passwordMatchValidator });
  }

  ngOnInit(): void { }

  register() {

    const dataToSave: RegisterInterface ={
      name: this.form.get('name')?.value,
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value,
      password_confirmation: this.form.get('passwordConfirmation')?.value,
    };

    this.isLoading = true;
    this.authService
      .register(dataToSave)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response) => {
          console.log(response.body);
          // if (this.loggedUser !== null) {
          //   this.form.reset();
          //   this.router.navigate(["login"]);
          // }
        },
        error: (error) => {
          if (error.error.error === 'REGISTRATION_DISABLED') {
            this.translatedToastService.error('register.errors.registrationDisabled');
          } else {
            this.translatedToastService.error('register.errors.anotherError');
          }
        },
        complete: () => { },
      });
  }

}
