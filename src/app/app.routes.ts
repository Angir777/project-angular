import { Routes } from '@angular/router';
import { AuthGuard } from './helpers/guards/auth.guard';
import { PublicComponent } from './layout/public/public.component';
import { DashboardComponent } from './layout/dashboard/dashboard.component';
import { LoginComponent } from './views/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { HomeComponent } from './views/home/home.component';
import { UsersComponent } from './views/users/users.component';
import { RolesComponent } from './views/roles/roles.component';
import { ForbiddenComponent } from './views/forbidden/forbidden.component';
import { NotfoundComponent } from './views/notfound/notfound.component';
import { ErrorComponent } from './layout/error/error.component';
import { AccountConfirmationComponent } from './views/account-confirmation/account-confirmation.component';
import { PasswordResetComponent } from './views/password-reset/password-reset.component';
import { PasswordResetFinishComponent } from './views/password-reset-finish/password-reset-finish.component';

export const routes: Routes = [
    { 
        path: '', 
        redirectTo: 'login', 
        pathMatch: 'full' 
    },
    {
        path: '',
        component: PublicComponent, 
        children: [
            { 
                path: 'login', 
                component: LoginComponent, 
                data: { 
                    title: 'pageTitle.login' 
                } 
            },
            { 
                path: 'register', 
                component: RegisterComponent,
                data: { 
                    title: 'pageTitle.register' 
                } 
            },
            { 
                path: 'account-confirmation/:code', 
                component: AccountConfirmationComponent,
                data: { 
                    title: 'pageTitle.accountConfirmation' 
                } 
            },
            { 
                path: 'password-reset', 
                component: PasswordResetComponent,
                data: { 
                    title: 'pageTitle.passwordReset' 
                } 
            },
            { 
                path: 'finish-reset-password/:code', 
                component: PasswordResetFinishComponent,
                data: { 
                    title: 'pageTitle.passwordResetFinish' 
                } 
            }
        ]
    },
    {
        path: '',
        component: ErrorComponent,
        children: [
            { 
                path: '403', 
                component: ForbiddenComponent 
            },
            { 
                path: '404', 
                component: NotfoundComponent 
            },
        ]
    },
    {
        path: '',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        children: [
            { 
                path: 'home', 
                component: HomeComponent 
            },
            { 
                path: 'users', 
                component: UsersComponent 
            },
            { 
                path: 'roles', 
                component: RolesComponent 
            }
        ]
    },
    { 
        path: '**', 
        redirectTo: '/404' 
    },
];
