import { Routes } from '@angular/router';
import { AuthGuard } from './helpers/guards/auth.guard';
import { PublicComponent } from './layout/public/public.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { LoginComponent } from './views/public/auth/login/login.component';
import { RegisterComponent } from './views/public/auth/register/register.component';
import { HomeComponent } from './views/dashboard/home/home.component';
import { ForbiddenComponent } from './views/error/forbidden/forbidden.component';
import { NotfoundComponent } from './views/error/notfound/notfound.component';
import { ErrorComponent } from './layout/error/error.component';
import { AccountConfirmationComponent } from './views/public/auth/account-confirmation/account-confirmation.component';
import { PasswordResetComponent } from './views/public/auth/password-reset/password-reset.component';
import { PasswordResetFinishComponent } from './views/public/auth/password-reset-finish/password-reset-finish.component';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { SettingsComponent } from './views/dashboard/settings/settings.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: PublicComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
        data: {
          title: 'pageTitle.login',
        },
      },
      {
        path: 'register',
        component: RegisterComponent,
        data: {
          title: 'pageTitle.register',
        },
      },
      {
        path: 'account-confirmation/:code',
        component: AccountConfirmationComponent,
        data: {
          title: 'pageTitle.accountConfirmation',
        },
      },
      {
        path: 'password-reset',
        component: PasswordResetComponent,
        data: {
          title: 'pageTitle.passwordReset',
        },
      },
      {
        path: 'finish-reset-password/:code',
        component: PasswordResetFinishComponent,
        data: {
          title: 'pageTitle.passwordResetFinish',
        },
      },
    ],
  },
  {
    path: '',
    component: ErrorComponent,
    children: [
      {
        path: '403',
        component: ForbiddenComponent,
      },
      {
        path: '404',
        component: NotfoundComponent,
      },
    ],
  },
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'settings',
        component: SettingsComponent,
        canActivate: [NgxPermissionsGuard],
        data: {
          permissions: {
            only: ['USER'],
            redirectTo: '/',
          },
        },
      },
      {
        path: 'users',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./views/dashboard/users/users.routes').then(
                m => m.usersRoutes
              ),
          },
        ],
      },
      {
        path: 'roles',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./views/dashboard/role/role.routes').then(
                m => m.roleRoutes
              ),
          },
        ],
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/404',
  },
];
