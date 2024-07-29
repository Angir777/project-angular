import { AfterViewInit, ChangeDetectorRef, Component, HostListener, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { BaseComponent } from './base-component';
import { environment } from '../../environments/environment';
import { TABLE_STATE_KEY } from '../constants/global';
import { FILTERING_DEBOUNCE_TIME } from '../constants/filtering.const';
import { TranslateService } from '@ngx-translate/core';

/**
 * Abstrakcyjny komponent do wyświetlania danych tabelarycznych z użyciem angular material.
 */
@Component({
  template: '',
})
export abstract class BaseTableWithCriteriaComponent extends BaseComponent implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Wartości z ustawień projektu
  readonly PAGE_SIZES: number[] = environment.PAGE_SIZES;
  readonly DEFAULT_PAGE_SIZE: number = environment.DEFAULT_PAGE_SIZE;

  filterSubject$: Subject<any> = new Subject<any>();

  // Kryteria filtrowania po poszczególnych kolumnach.
  criteria: any = {};
  criteriaChangedSubject$: Subject<any> = new Subject<any>();

  // Loader.
  isLoadingResults = true;

  // Ilość danych do wyświetlenia.
  resultsLength = 0;

  // Lista wyświetlanych kolumn.
  displayedColumns: string[] = [];

  // Czy checkbox "Zapamiętaj stan" jest włączony?
  saveActive = false;

  // Czy zapisywać w localStorage ustawienia?
  saveState = false;

  // Klucz pod którym zapamiętujemy konfigurację tego komponentu w localStorage.
  protected readonly LOCAL_STORAGE_SAVED_STATE_KEY: string;
  tableState: string | null = null;

  protected constructor(
    @Inject(String) private localStorageComponentKey: string,
    private cdr: ChangeDetectorRef,
    private translateService: TranslateService,
  ) {
    super();
    this.LOCAL_STORAGE_SAVED_STATE_KEY = `${this.localStorageComponentKey}-${TABLE_STATE_KEY}`;
    this.tableState = localStorage.getItem(this.LOCAL_STORAGE_SAVED_STATE_KEY);
  }

  ngOnInit(): void {
    this.saveActive = environment.PERSIST_TABLE_STATE_BEFORE_UNLOAD;
  }

  ngOnDestroy(): void {
    this.persistState();
  }

  @HostListener('window:beforeunload')
  onBeforeUnload() {
    if (environment.PERSIST_TABLE_STATE_BEFORE_UNLOAD) {
      this.persistState();
    }
  }

  ngAfterViewInit(): void {
    if (this.paginator == null) {
      throw new Error('Paginator is null');
    }
    if (this.sort == null) {
      throw new Error('Sort is null');
    }
    this.restoreState(); // W tym miejscu działa, ale wali błędem "Error: NG0100: ExpressionChangedAfterItHasBeenCheckedError".
    this.cdr.detectChanges(); // Dlatego tutaj wykrywamy ręcznie zmiany (ale musimy przekazywać cdr).
    this.prepareCriteriaChangedSubject();

    // Zmiana tłumaczenia ilości wpisów na stronę
    this.paginator._intl.itemsPerPageLabel = this.translateService.instant('global.table.itemsPerPage');
  }

  // Zapisanie stanu tabeli do pamięci lokalnej.
  persistState(): void {
    if (!this.saveState) {
      return;
    }

    localStorage.setItem(
      this.LOCAL_STORAGE_SAVED_STATE_KEY,
      JSON.stringify({
        saveState: this.saveState,
        pageSize: this.paginator.pageSize,
        pageIndex: this.paginator.pageIndex,
        sortColumn: this.sort.active,
        sortDirection: this.sort.direction,
        criteria: this.criteria,
        displayedColumns: this.displayedColumns,
      })
    );
  }

  // Odtworzenie stanu tabeli z pamięci lokalnej.
  restoreState(): void {
    if (this.tableState != null) {
      // Usunięcie aktualnych ustawień tabelki.
      localStorage.removeItem(this.LOCAL_STORAGE_SAVED_STATE_KEY);

      // Przypisanie aktualnych ustawień tabelki pobranych przed ich usunięciem.
      const restoredState: any = JSON.parse(this.tableState);
      if (restoredState.saveState != null) {
        this.saveState = restoredState.saveState;
      }
      if (restoredState.pageSize != null) {
        this.paginator.pageSize = restoredState.pageSize;
      }
      if (restoredState.pageIndex != null) {
        this.paginator.pageIndex = restoredState.pageIndex;
      }
      if (restoredState.sortColumn != null) {
        this.sort.active = restoredState.sortColumn;
      }
      if (restoredState.sortDirection != null) {
        this.sort.direction = restoredState.sortDirection;
      }
      if (restoredState.criteria != null) {
        this.criteria = restoredState.criteria;
      }
      if (restoredState.displayedColumns != null) {
        this.displayedColumns = restoredState.displayedColumns;
      }
    }
  }

  // Przygotowanie subject nasłuchującego na zmiane w filtrach.
  private prepareCriteriaChangedSubject() {
    this.criteriaChangedSubject$
      .pipe(
        debounceTime(FILTERING_DEBOUNCE_TIME),
        distinctUntilChanged(),
        tap(() => {
          this.resetPaginator();
          this.filterSubject$.next(null);
        })
      )
      .subscribe();
  }

  // Wyszukiwanie z użyciem pola input.
  search(event: any): void {
    this.criteriaChangedSubject$.next(event.target.value);
  }

  // Wyszukiwanie z użyciem pola select.
  onFilterSelect(): void {
    this.resetPaginator();
    this.filterSubject$.next(null);
  }

  // Zresetowanie ustawień paginacji.
  resetPaginator(): void {
    if (this.paginator != null) {
      this.paginator.pageIndex = 0;
    }
  }

  // Odświeżenie tabeli.
  refreshTable(): void {
    this.filterSubject$.next(null);
  }
}
