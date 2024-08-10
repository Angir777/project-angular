import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { User } from '../../../../models/user/user';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSpinner, faPlusCircle, faSortDown, faHistory, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { BaseTableWithCriteriaComponent } from '../../../../components/base-table-with-criteria.component';
import { MatTableLoaderComponent } from '../../../../components/mat-table-loader/mat-table-loader.component';
import { Role } from '../../../../models/role/role';
import { UserService } from '../../../../services/user/user.service';
import { RoleService } from '../../../../services/role/role.service';
import { TranslatedSwalService } from '../../../../services/translation/translated-swal.service';
import { TranslatedToastService } from '../../../../services/translation/translated-toast.service';
import { merge, startWith, switchMap, map, catchError, of, finalize } from 'rxjs';
import { prepareSortParams } from '../../../../utils/sort-params.utils';
import { AuthUser } from '../../../../models/auth/auth-user';
import { LoggedUserService } from '../../../../services/logged-user/logged-user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    InputSwitchModule,
    InputTextModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableLoaderComponent,
    MatTableModule,
    MatTooltipModule,
    NgxPermissionsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    NgSelectModule,
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent extends BaseTableWithCriteriaComponent implements AfterViewInit {
  // font-awesome icons
  faSpinner = faSpinner;
  faPlusCircle = faPlusCircle;
  faSortDown = faSortDown;
  faHistory = faHistory;
  faEdit = faEdit;
  faTrash = faTrash;

  override displayedColumns: string[] = ['actions', 'id', 'name', 'email', 'roles', 'confirmed'];
  data: User[] = [];

  isLoadingRole = false;
  roles: Role[] = [];

  // Aktualnie zalogowany użytkownik
  get user(): AuthUser {
    return <AuthUser>this.loggedUserService.get();
  }

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private translatedToastService: TranslatedToastService,
    private translatedSwalService: TranslatedSwalService,
    private loggedUserService: LoggedUserService,
    translateService: TranslateService,
    cdr: ChangeDetectorRef
  ) {
    super('users', cdr, translateService);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    // Ładuje dostępne role
    this.getRole();
    // Zresetowanie ustawień paginacji
    this.sort.sortChange.subscribe(() => this.resetPaginator());
    // Wczytanie danych
    merge(this.sort.sortChange, this.paginator.page, this.filterSubject$)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.userService.query({
            sort: prepareSortParams(this.sort.active, this.sort.direction),
            page: this.paginator.pageIndex + 1,
            pageSize: this.paginator.pageSize,
            ...this.criteria,
          });
        }),
        map((data) => {
          this.isLoadingResults = false;
          if (data.body != null) {
            this.resultsLength = data.body.totalCount;
            return data.body.items;
          }
          return [];
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.translatedToastService.error('user.error.cantQuery');
          return of([]);
        })
      )
      .subscribe((data) => (this.data = data));
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
            console.log(this.roles);
          }
        },
        error: () => {
          this.translatedToastService.error('user.error.cantRoleQuery');
        },
      });
  }

  // Usunięcie wybranego uzytkownika
  async delete(user: User) {
    const result = await this.translatedSwalService.showAsync(
      {
        icon: 'question',
        title: 'user.message.areYouSureYouWantDelete',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'global.button.yes',
        cancelButtonText: 'global.button.no',
      },
      {
        title: {
          email: user.email,
        },
      }
    );

    if (result.isConfirmed) {
      user.isDeleting = true;
      this.userService
        .delete(user.id)
        .pipe(
          finalize(() => {
            user.isDeleting = false;
          })
        )
        .subscribe({
          next: (response) => {
            if (response.body != null) {
              this.refreshTable();
              this.translatedToastService.success('user.success.deletedSuccessfully');
            }
          },
          error: (error: HttpErrorResponse) => {
            if (error.error.error != null && error.error.error === 'CANT_DELETE_OWN_ACCOUNT') {
              this.translatedSwalService.show({
                icon: 'error',
                text: 'user.error.cantDeleteOwnAccount',
              });
            } else {
              this.translatedToastService.error('user.error.cantDelete');
            }
          },
          complete: () => {},
        });
    }
  }

  // Sprawdza czy dany użytkownik posiada rolę 'SUPER_ADMIN'
  isSuperAdmin(roles: any) {
    if (roles.indexOf('SUPER_ADMIN') !== -1) {
      return true;
    } else {
      return false;
    }
  }
}
