import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { Role } from '../../../../models/role/role';
import { BaseTableWithCriteriaComponent } from '../../../../components/base-table-with-criteria.component';
import { RoleService } from '../../../../services/role/role.service';
import { TranslatedToastService } from '../../../../services/translation/translated-toast.service';
import { TranslatedSwalService } from '../../../../services/translation/translated-swal.service';
import { catchError, finalize, map, merge, of, startWith, switchMap } from 'rxjs';
import { prepareSortParams } from '../../../../utils/sort-params.utils';
import { MatTableLoaderComponent } from '../../../../components/mat-table-loader/mat-table-loader.component';
import { MatSortModule } from '@angular/material/sort';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxPermissionsModule } from 'ngx-permissions';
import { RouterModule } from '@angular/router';
import { faEdit, faHistory, faPlusCircle, faSortDown, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
import { MatTableModule } from '@angular/material/table';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-roles-list',
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
  ],
  templateUrl: './roles-list.component.html',
  styleUrl: './roles-list.component.scss',
})
export class RolesListComponent extends BaseTableWithCriteriaComponent implements AfterViewInit {
  // font-awesome icons
  faSpinner = faSpinner;
  faPlusCircle = faPlusCircle;
  faSortDown = faSortDown;
  faHistory = faHistory;
  faEdit = faEdit;
  faTrash = faTrash;

  override displayedColumns: string[] = ['actions', 'id', 'name', 'guardName'];
  data: Role[] = [];

  constructor(
    private roleService: RoleService,
    private translatedToastService: TranslatedToastService,
    private translatedSwalService: TranslatedSwalService,
    cdr: ChangeDetectorRef
  ) {
    super('roles', cdr);
  }

  override ngAfterViewInit(): void {
    super.ngAfterViewInit();
    // Zresetowanie ustawień paginacji
    this.sort.sortChange.subscribe(() => this.resetPaginator());
    // Wczytanie danych
    merge(this.sort.sortChange, this.paginator.page, this.filterSubject$)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.roleService.query({
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
          this.translatedToastService.error('role.error.cantQuery');
          return of([]);
        })
      )
      .subscribe((data) => (this.data = data));
  }

  // Usunięcie wybranej roli
  async delete(role: Role) {
    const result = await this.translatedSwalService.showAsync(
      {
        icon: 'question',
        title: 'role.message.areYouSureYouWantDelete',
        showConfirmButton: true,
        showCancelButton: true,
        confirmButtonText: 'global.button.yes',
        cancelButtonText: 'global.button.no',
      },
      {
        title: {
          name: role.name,
        },
      }
    );

    if (result.isConfirmed) {
      role.isDeleting = true;

      this.roleService
        .delete(role.id)
        .pipe(
          finalize(() => {
            role.isDeleting = false;
          })
        )
        .subscribe({
          next: (response) => {
            if (response.body != null) {
              this.refreshTable();
              this.translatedToastService.success('role.success.deletedSuccessfully');
            }
          },
          error: () => {
            this.translatedToastService.error('role.errors.cantDelete');
          },
          complete: () => {},
        });
    }
  }
}
