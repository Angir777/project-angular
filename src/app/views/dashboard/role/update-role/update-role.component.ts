import { Component, OnInit } from '@angular/core';
import { BaseFormComponent } from '../../../../components/base-component';
import { Role } from '../../../../models/role/role';
import { PermissionGroup } from '../../../../models/auth/permission-group';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Params, RouterModule } from '@angular/router';
import { RoleService } from '../../../../services/role/role.service';
import { TranslatedSwalService } from '../../../../services/translation/translated-swal.service';
import { TranslatedToastService } from '../../../../services/translation/translated-toast.service';
import { PermissionService } from '../../../../services/permission/permission.service';
import { finalize } from 'rxjs';
import { Permission } from '../../../../models/auth/permission';
import { validateAllFormFields } from '../../../../utils/form.utils';
import { CommonModule } from '@angular/common';
import { NgxPermissionsModule } from 'ngx-permissions';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableLoaderComponent } from '../../../../components/mat-table-loader/mat-table-loader.component';
import { InputTextModule } from 'primeng/inputtext';
import { AutoFocusModule } from 'primeng/autofocus';
import { FormControlErrorsComponent } from '../../../../components/form-control-errors/form-control-errors.component';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { InputSwitchModule } from 'primeng/inputswitch';
import { faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-update-role',
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
  templateUrl: './update-role.component.html',
  styleUrl: './update-role.component.scss',
})
export class UpdateRoleComponent extends BaseFormComponent implements OnInit {
  faSpinner = faSpinner;
  faSave = faSave;
  
  title = '';

  isLoadingRole = false;
  role: Role | null = null;

  isLoadingPermissionGroups = false;
  permissionGroups: PermissionGroup[] = [];

  constructor(
    private roleService: RoleService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private permissionService: PermissionService,
    private translatedSwalService: TranslatedSwalService,
    private translatedToastService: TranslatedToastService
  ) {
    super();
  }

  ngOnInit(): void {
    this.createForm();

    // Określenie czy jest to edycja, czy dodanie nowej roli.
    this.route.params.subscribe((params: Params) => {
      if (params['id'] != null) {
        this.title = 'role.editTitle';
        this.getRole(+params['id']);
      } else {
        this.title = 'role.addTitle';
        this.getPermissionGroups();
      }
    });
  }

  // Utworzenie nowego formularza.
  createForm() {
    this.form = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required]],
      guardName: [{ value: 'web', disabled: true }, [Validators.required]],
    });
  }

  // Pobranie uprawnień jakie można nadać
  getPermissionGroups(): void {
    this.isLoadingPermissionGroups = true;
    this.roleService
      .getPermissions()
      .pipe(
        finalize(() => {
          this.isLoadingPermissionGroups = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response.body) {
            this.preparePermissionsToShow(response.body);
          }
        },
        error: () => {
          this.translatedToastService.error('role.error.cantPermissionsQuery');
        },
      });
  }

  // Pobranie roli, jeśli to jest edycja.
  getRole(id: number) {
    this.isLoadingRole = true;
    this.roleService
      .getById(id)
      .pipe(
        finalize(() => {
          this.isLoadingRole = false;
        })
      )
      .subscribe({
        next: (response) => {
          // Tworzy nowy obiekt.
          this.role = new Role(response.body);
          // Dodatkowe sprawdzenie, czy nie jest on 'null'.
          if (this.role !== null) {
            // Aktualizacja formularza.
            this.updateForm(this.role);
            this.getPermissionGroups();
          }
          
        },
        error: () => {
          this.translatedToastService.error('role.error.cantRoleQuery');
        },
      });
  }

  // Jeśli jest edycja, to aktualizujemy pola formularza.
  updateForm(role: Role) {
    // Wstawienie aktualnych danych do formularza.
    this.form.patchValue(role);
  }

  onToggleChange(event: any, permission: Permission) {
    // Aktualizowanie stanu isSelected w obiekcie permission
    permission.isSelected = event.value;

    this.preparePermissionsToSave();
  }

  // Zapis
  save() {
    validateAllFormFields(this.form);

    const dataToSave: Role = new Role({
      id: this.role != null ? this.role.id : null,
      name: this.form.get(['name'])!.value,
      guardName: this.form.get(['guardName'])!.value,
      permissionIds: this.preparePermissionsToSave(),
    });

    // Brak wybranych uprawnień
    if (dataToSave.permissionIds?.length == 0) {
      this.translatedSwalService.show(
        {
          icon: 'warning',
          text: 'role.error.needPermissions',
          showConfirmButton: true,
          confirmButtonText: 'global.button.ok',
        }
      );
      return;
    }

    if (this.role == null) {
      this.create(dataToSave);
    } else {
      this.update(dataToSave);
    }
  }

  private create(role: Role): void {
    this.isSaving = true;
    this.roleService
      .create(role)
      .pipe(
        finalize(() => {
          this.isSaving = false;
        })
      )
      .subscribe({
        next: () => {
          this.translatedToastService.success('role.success.createdSuccessfully');
          this.previousState();
        },
        error: (error) => {
          if (error.error != null && error.error.errors != null) {
            this.serverErrors = error.error.errors;
          }
          this.translatedToastService.error('role.error.cantCreate');
        },
      });
  }

  private update(role: Role): void {
    this.isSaving = true;
    this.roleService
      .update(role)
      .pipe(
        finalize(() => {
          this.isSaving = false;
        })
      )
      .subscribe({
        next: () => {
          this.translatedToastService.success('role.success.updatedSuccessfully');
          this.previousState();
        },
        error: (error) => {
          if (error.error != null && error.error.errors != null) {
            this.serverErrors = error.error.errors;
          }
          this.translatedToastService.error('role.error.cantUpdate');
        },
      });
  }

  private preparePermissionsToShow(permissions: Permission[]) {
    permissions.forEach((permission, index) => {
      permissions[index].isSelected = this.role !== null && this.role.hasPermission(permission);
    });
    this.permissionGroups = this.permissionService.groupPermissions(permissions);
  }

  private preparePermissionsToSave(): number[] {
    let selectedPermissions: number[] = [];
    this.permissionGroups.forEach((permissionGroup: PermissionGroup) => {
      const selectedPermissionInGroup: number[] = permissionGroup.permissions
        .filter((permission: Permission) => permission.isSelected) // Filtracja tylko zaznaczonych
        .map((permission: Permission) => permission.id) // Mapowanie na id
        .filter((id): id is number => id !== null); // Usunięcie `null`
      selectedPermissions = selectedPermissions.concat(selectedPermissionInGroup);
    });
    return selectedPermissions;
  }
}
