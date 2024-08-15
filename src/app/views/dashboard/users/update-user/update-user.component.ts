import { Component, OnInit } from '@angular/core';
import { User } from '../../../../models/user/user';
import { Role } from '../../../../models/role/role';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router, RouterModule } from '@angular/router';
import { BaseFormComponent } from '../../../../components/base-component';
import { LoggedUserService } from '../../../../services/logged-user/logged-user.service';
import { RoleService } from '../../../../services/role/role.service';
import { TranslatedSwalService } from '../../../../services/translation/translated-swal.service';
import { TranslatedToastService } from '../../../../services/translation/translated-toast.service';
import { UserService } from '../../../../services/user/user.service';
import { hasPermission } from '../../../../utils/permission.utils';
import { finalize } from 'rxjs';
import { validateAllFormFields } from '../../../../utils/form.utils';
import { faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MatTableLoaderComponent } from '../../../../components/mat-table-loader/mat-table-loader.component';
import { AutoFocusModule } from 'primeng/autofocus';
import { RippleModule } from 'primeng/ripple';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { FormControlErrorsComponent } from '../../../../components/form-control-errors/form-control-errors.component';

@Component({
  selector: 'app-update-user',
  standalone: true,
  imports: [
    FormControlErrorsComponent,
    FormsModule,
    ReactiveFormsModule,
    MatTableLoaderComponent,
    CommonModule,
    NgxPermissionsModule,
    TranslateModule,
    InputTextModule,
    AutoFocusModule,
    ToggleButtonModule,
    InputSwitchModule,
    RippleModule,
    ButtonModule,
    FontAwesomeModule,
    RouterModule
  ],
  templateUrl: './update-user.component.html',
  styleUrl: './update-user.component.scss'
})
export class UpdateUserComponent extends BaseFormComponent implements OnInit {
  faSpinner = faSpinner;
  faSave = faSave;
  
  canEditSuperAdminAccount = false;
  title = '';

  isLoadingUser = false;
  user: User | null = null;

  isLoadingRole = false;
  roles: Role[] = [];

  constructor(
    private roleService: RoleService,
    private route: ActivatedRoute,
    private loggedUserService: LoggedUserService,
    private formBuilder: FormBuilder,
    private translatedSwalService: TranslatedSwalService,
    private translatedToastService: TranslatedToastService,
    private router: Router,
    private userService: UserService
  ) {
    super();
    // Sprawdzenie, czy aktualnie zalogowany użytkownik ma rolę 'SUPER_ADMIN'.
    this.canEditSuperAdminAccount = hasPermission('SUPER_ADMIN', loggedUserService.getPermissions());
  }

  ngOnInit(): void {
    this.createForm();
    this.getRole();

    // Określenie czy jest to edycja, czy dodanie nowego użytkownika.
    this.route.params.subscribe((params: Params) => {
      if (params['id'] != null) {
        this.title = 'user.editTitle';
        this.getUser(+params['id']);
      } else {
        this.title = 'user.addTitle';
      }
    });
  }

  // Utworzenie nowego formularza.
  createForm() {
    this.form = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      confirmed: [false, []],
    });
  }

  // Jeśli jest edycja, to aktualizujemy pola formularza.
  updateForm(user: User) {
    // Sprawdzenie, czy dane konto należy do super admina.
    // Jeśli tak to następuje sprawdzenie, czy zalogowany użytkownik może edytować takie konto.
    if (this.isSuperAdmin(user.roles)) {
      // Jeśli nie ma uprawnień, to blokujemy dostęp.
      if (!this.canEditSuperAdminAccount) {
        this.translatedToastService.error('global.errors.noPermissions');
        this.router.navigate(['/user']);
      }
    }
    // Wstawienie aktualnych danych do formularza.
    this.form.patchValue(user);
  }

  // Pobranie użytkownika, jeśli to jest edycja.
  getUser(id: number) {
    this.isLoadingUser = true;
    this.userService
      .getById(id)
      .pipe(
        finalize(() => {
          this.isLoadingUser = false;
        })
      )
      .subscribe({
        next: (response) => {
          // Tworzy nowy obiekt.
          this.user = new User(response.body);
          // Dodatkowe sprawdzenie, czy nie jest on 'null'.
          if (this.user !== null) {
            // Aktualizacja formularza.
            this.updateForm(this.user);
            // Zaznaczenie aktywnych ról.
            this.prepareRolesToShow();
          }
        },
        error: () => {
          this.translatedToastService.error('user.errors.cantUserQuery');
        },
      });
  }

  // Pobranie wszystkich roli, jakie można przypisać użytkownikowi.
  getRole(): void {
    this.isLoadingRole = true;
    this.roleService
      .getAll()
      .pipe(
        finalize(() => {
          this.isLoadingRole = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response.body) {
            this.roles = response.body;
          }
        },
        error: () => {
          this.translatedToastService.error('user.errors.cantRoleQuery');
        },
      })
  }

  // Sprawdzenie, czy dany użytkownik posiada rolę 'SUPER_ADMIN'.
  isSuperAdmin(roles: any) {
    if (roles.indexOf('SUPER_ADMIN') !== -1) {
      return true;
    } else {
      return false;
    }
  }

  // Zapis
  save() {
    validateAllFormFields(this.form);

    // Sprawdzenie, czy edytowany/nowy użytkownik ma wybraną rolę.
    const isSelectedExists = this.roles.some((role) => role.isSelected === true);
    if (!isSelectedExists) {
      this.translatedSwalService.show(
        {
          icon: 'warning',
          text: 'user.warning.chooseRole',
          showConfirmButton: true,
          confirmButtonText: 'global.button.ok',
        }
      );
      return;
    }

    const dataToSave: User = new User({
      id: this.user != null ? this.user.id : null,
      name: this.form.get(['name'])!.value,
      email: this.form.get(['email'])!.value,
      confirmed: this.form.get(['confirmed'])!.value,
      roles: this.prepareRolesToSave(),
    });

    if (this.user == null) {
      this.create(dataToSave);
    } else {
      this.update(dataToSave);
    }
  }

  private create(user: User): void {
    this.isSaving = true;
    this.userService
      .create(user)
      .pipe(
        finalize(() => {
          this.isSaving = false;
        })
      )
      .subscribe({
        next: () => {
          this.translatedToastService.success('user.success.createdSuccessfully');
          this.previousState();
        },
        error: (error) => {
          if (error.error != null && error.error.errors != null) {
            this.serverErrors = error.error.errors;
          }
          this.translatedToastService.error('user.error.cantCreate');
        },
      });
  }

  private update(user: User): void {
    this.isSaving = true;
    this.userService
      .update(user)
      .pipe(
        finalize(() => {
          this.isSaving = false;
        })
      )
      .subscribe({
        next: () => {
          this.translatedToastService.success('user.success.updatedSuccessfully');
          this.previousState();
        },
        error: (error) => {
          if (error.error != null && error.error.errors != null) {
            this.serverErrors = error.error.errors;
          }
          this.translatedToastService.error('user.error.cantUpdate');
        },
      });
  }

  // Zaznaczenie przypisanych aktualnie ról.
  private prepareRolesToShow() {
    this.roles.forEach((role, index) => {
      this.roles[index].isSelected =
        this.user !== null &&
        role.name !== null &&
        this.user.hasRole(role.name);
    });
  }

  // Przygotowanie ról do zapisu
  private prepareRolesToSave(): string[] {
    const selectedRoles: any[] = this.roles
      .filter((role) => role.name !== null && role.isSelected)
      .map((role) => role.name);
    return selectedRoles;
  }
}
