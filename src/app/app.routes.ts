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

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    {
        path: '',
        component: PublicComponent, 
        children: [
            { path: 'login', component: LoginComponent },
            { path: 'register', component: RegisterComponent },
        ]
    },
    {
        path: '',
        component: ErrorComponent,
        children: [
            { path: '403', component: ForbiddenComponent },
            { path: '404', component: NotfoundComponent },
        ]
    },
    {
        path: '',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'home', component: HomeComponent },
            { path: 'users', component: UsersComponent },
            { path: 'roles', component: RolesComponent }
        ]
    },
    { path: '**', redirectTo: '/404' },
];
