import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-mat-table-loader',
  standalone: true,
  imports: [],
  templateUrl: './mat-table-loader.component.html',
  styleUrls: ['./mat-table-loader.component.scss'],
})
export class MatTableLoaderComponent {
  @Input() isLoading = false;
}
