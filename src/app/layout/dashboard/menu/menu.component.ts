import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MenuItemComponent } from './menu-item/menu-item.component';
import { LoggedUserService } from '../../../services/logged-user/logged-user.service';
import { PermissionsHelper } from '../../../helpers/permissions/permissionsHelper';
import { PermissionModes } from '../../../constants/permission-modes.const';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    MenuItemComponent
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit {

    model: any[] = [];
    userPermissions: string[] = [];

    constructor(
        private loggedUserService: LoggedUserService,
    ) { }

    ngOnInit() {
        this.userPermissions = this.loggedUserService.getPermissions();

        this.model = [
            {
                label: 'pageTitle.homePage',
                permissionsMode: PermissionModes.AT_LEAST_ONE,
                items: [
                    { 
                        label: 'pageTitle.homePage', 
                        icon: 'pi pi-fw pi-home', 
                        routerLink: ['/'],
                    }
                ]
            },
            {
                label: 'pageTitle.userManagement',
                permissions: ['USER_MANAGE', 'USER_ACCESS', 'ROLE_MANAGE', 'ROLE_ACCESS'],
                permissionsMode: PermissionModes.AT_LEAST_ONE,
                items: [
                    { 
                        label: 'pageTitle.users', 
                        icon: 'pi pi-fw pi-users', 
                        routerLink: ['/users'],
                        permissions: ['USER_MANAGE', 'USER_ACCESS'],
                        permissionsMode: PermissionModes.AT_LEAST_ONE,
                    },
                    { 
                        label: 'pageTitle.roles', 
                        icon: 'pi pi-fw pi-shield', 
                        routerLink: ['/roles'],
                        permissions: ['ROLE_MANAGE', 'ROLE_ACCESS'],
                        permissionsMode: PermissionModes.AT_LEAST_ONE,
                    },
                ]
            }
        ];

        this.model = this.filterNavItems(this.model, this.userPermissions);
    }

    filterNavItems(navItems: any[], userPermissions: string[]): any[] {
        return navItems.filter(item => {

            if (item.items) {
                item.items = this.filterNavItems(item.items, userPermissions);
            }

            if (item.permissions) {
                return PermissionsHelper.checkPermission(item.permissions, userPermissions, item.permissionsMode);
            }

            return true;
        });
    }
}
