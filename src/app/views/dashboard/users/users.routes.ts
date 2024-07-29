import { Route } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { UsersComponent } from './users.component';

/**
 * users routing
 */
export const usersRoutes: Route[] = [
  {
    path: '',
    component: UsersComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['USER_MANAGE', 'USER_ACCESS'],
        redirectTo: '/',
      },
      breadcrumb: 'odk.odkDictionary.odkFscStatement.pageTitle',
    },
  },
  // {
  //   path: 'new',
  //   component: UpdateRoleComponent,
  //   canActivate: [NgxPermissionsGuard],
  //   data: {
  //     permissions: {
  //       only: ['ROLE_MANAGE'],
  //       redirectTo: '/',
  //     },
  //     breadcrumb: 'odk.odkDictionary.odkFscStatement.addTitle',
  //   },
  // },
  // {
  //   path: ':id/edit',
  //   component: UpdateRoleComponent,
  //   canActivate: [NgxPermissionsGuard],
  //   data: {
  //     permissions: {
  //       only: ['ROLE_MANAGE'],
  //       redirectTo: '/',
  //     },
  //     breadcrumb: 'odk.odkDictionary.odkFscStatement.editTitle',
  //   },
  // },
];
