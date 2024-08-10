import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { faArrowLeftLong, faSpinner, faTrashArrowUp } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BaseTableWithCriteriaComponent } from '../../../../components/base-table-with-criteria.component';
import { User } from '../../../../models/user/user';
import { TranslatedSwalService } from '../../../../services/translation/translated-swal.service';
import { TranslatedToastService } from '../../../../services/translation/translated-toast.service';
import { UserService } from '../../../../services/user/user.service';
import { merge, startWith, switchMap, map, catchError, of, finalize } from 'rxjs';
import { prepareSortParams } from '../../../../utils/sort-params.utils';
import moment from 'moment';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { MatTableLoaderComponent } from '../../../../components/mat-table-loader/mat-table-loader.component';

@Component({
  selector: 'app-delete-users-list',
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
    TranslateModule
  ],
  templateUrl: './delete-users-list.component.html',
  styleUrl: './delete-users-list.component.scss'
})
export class DeleteUsersListComponent  extends BaseTableWithCriteriaComponent implements AfterViewInit {
  // font-awesome icons
  faSpinner = faSpinner;
  faArrowLeftLong = faArrowLeftLong;
  faTrashArrowUp = faTrashArrowUp;

  override displayedColumns: string[] = ['actions', 'id', 'name', 'email', 'deletedAt'];
  data: User[] = [];

  constructor(
    private userService: UserService,
    private translatedToastService: TranslatedToastService,
    private translatedSwalService: TranslatedSwalService,
    translateService: TranslateService,
    cdr: ChangeDetectorRef
  ) {
    super('users', cdr, translateService);
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
          return this.userService.queryDeleted({
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

  // Przywrócenie wybranego użytkownika
  async restore(user: User) {
    const result = await this.translatedSwalService.showAsync(
      {
        icon: 'question',
        title: 'user.message.areYouSureYouWantRestore',
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
      user.isRestoring = true;
      this.userService
        .restore(user.id)
        .pipe(
          finalize(() => {
            user.isRestoring = false;
          })
        )
        .subscribe({
          next: () => {
            this.refreshTable();
            this.translatedToastService.success('user.success.restoredSuccessfully');
          },
          error: () => {
            this.translatedToastService.error('user.error.cantRestore');
          },
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

  // "Data usunięcia" - Sformatowanie i ujednolicenie daty wyświetlanej w tabeli
  formatDate(date: string): string {
    return moment.utc(date).format('DD-MM-YYYY HH:mm:ss');
  }
}
