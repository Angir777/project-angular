import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import _ from 'lodash';
import { finalize } from 'rxjs';
import { TranslatedToastService } from '../../services/translation/translated-toast.service';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { LoggedUserService } from '../../services/logged-user/logged-user.service';

@Component({
  selector: 'app-account-confirmation',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  templateUrl: './account-confirmation.component.html',
  styleUrl: './account-confirmation.component.scss'
})
export class AccountConfirmationComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private loggedUserService: LoggedUserService,
    private route: ActivatedRoute,
    private router: Router,
    private translatedToastService: TranslatedToastService
  ) {
    // Jeśli user jest zalogowany to przekierowywujemy go na stronę domową
    if (this.loggedUserService.isAuthenticated()) {
      this.router.navigate(['/home']);
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      if (!_.isNil(params['code'])) {
        this.accountConfirmation(params['code']);
      } else {
        this.router.navigate(["login"]);
      }
    });
  }

  accountConfirmation(code: string) {
    this.authService
      .confirmAccount(code)
      .pipe(
        finalize(() => {
          this.router.navigate(["login"]);
        })
      )
      .subscribe({
        next: (response) => {
          if (!_.isNil(response.body)) {
            this.translatedToastService.success('accountConfirmation.success.accountConfirmationSuccessText');
          }
        },
        error: (error) => {
          // Obsługujemy błędy
          if (error.error.error === 'CODE_INVALID') {
            this.translatedToastService.error('accountConfirmation.error.codeInvalidText');
          } else if (error.error.error === 'ALREADY_CONFIRMED') {
            this.translatedToastService.error('accountConfirmation.error.alreadyConfirmedText');
          } else {
            this.translatedToastService.error('accountConfirmation.error.anotherErrorText');
          }
        },
        complete: () => { },
      });
  }
}
