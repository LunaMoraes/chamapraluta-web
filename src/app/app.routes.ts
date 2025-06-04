import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { AdminComponent } from './admin/admin.component';
import { HomeRedirectGuard } from './home-redirect.guard';
import { LoginRedirectGuard } from './login-redirect.guard';
import { AdminGuard } from './admin.guard';

export const routes: Routes = [
    { path: '', component: DashboardComponent, canActivate: [HomeRedirectGuard], pathMatch: 'full' },
    { path: 'login', component: LoginComponent, canActivate: [LoginRedirectGuard] },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'calendario', component: CalendarioComponent },
    { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] }
];
