import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  logout() {
    this.authService
      .logout()
      .subscribe({
        next: (result) => {
          this.router.navigate(['/login']);
        },
        error: (error) => { },
      });
  }

}
