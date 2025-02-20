import { Component, signal } from '@angular/core';
import { LoggedUserService } from '../../../services/logged-user/logged-user.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-home',
    imports: [TranslateModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
  userName = signal<string | null | undefined>(null);

  constructor(private loggedUserService: LoggedUserService) {
    this.userName.set(loggedUserService.get()?.name);
  }
}
