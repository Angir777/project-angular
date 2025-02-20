import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-forbidden',
    imports: [TranslateModule, RouterModule],
    templateUrl: './forbidden.component.html',
    styleUrl: './forbidden.component.scss'
})
export class ForbiddenComponent {}
