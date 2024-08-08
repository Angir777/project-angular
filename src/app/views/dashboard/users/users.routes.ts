import { Route } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { UsersListComponent } from './users-list/users-list.component';
import { DeleteUsersListComponent } from './delete-users-list/delete-users-list.component';
import { UpdateUserComponent } from './update-user/update-user.component';

/**
 * users routing
 */
export const usersRoutes: Route[] = [
  {
    path: '',
    component: UsersListComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['USER_MANAGE', 'USER_ACCESS'],
        redirectTo: '/',
      },
      title: 'user.pageTitle',
    },
  },
  {
    path: 'deleted',
    component: DeleteUsersListComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['USER_MANAGE', 'USER_ACCESS'],
        redirectTo: '/',
      },
      title: 'user.deletedTitle',
    },
  },
  {
    path: 'new',
    component: UpdateUserComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['USER_MANAGE'],
        redirectTo: '/',
      },
      title: 'user.addTitle',
    },
  },
  {
    path: ':id/edit',
    component: UpdateUserComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['USER_MANAGE'],
        redirectTo: '/',
      },
      title: 'user.editTitle',
    },
  }
];
