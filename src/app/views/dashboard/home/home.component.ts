import { Component } from '@angular/core';
import { LoggedUserService } from '../../../services/logged-user/logged-user.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  userName!: string | null | undefined;

  constructor(private loggedUserService: LoggedUserService) {
    this.userName = loggedUserService.get()?.name;
  }
}
