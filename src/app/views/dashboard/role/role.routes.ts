import { Route } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { RolesListComponent } from './roles-list/roles-list.component';
import { UpdateRoleComponent } from './update-role/update-role.component';

/**
 * role routing
 */
export const roleRoutes: Route[] = [
  {
    path: '',
    component: RolesListComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ROLE_MANAGE', 'ROLE_ACCESS'],
        redirectTo: '/',
      },
      title: 'role.pageTitle',
    },
  },
  {
    path: 'new',
    component: UpdateRoleComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ROLE_MANAGE'],
        redirectTo: '/',
      },
      title: 'role.addTitle',
    },
  },
  {
    path: ':id/edit',
    component: UpdateRoleComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['ROLE_MANAGE'],
        redirectTo: '/',
      },
      title: 'role.editTitle',
    },
  },
];
