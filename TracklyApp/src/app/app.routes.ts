import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { LoginComponent } from './user/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './shared/auth.guard';
import { AdminOnlyComponent } from './authorizeDemo/admin-only/admin-only.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { claimReq } from './shared/utils/claimReq-utils';
import { PaymentsComponent } from './payments/payments.component';
import { Paths } from './shared/constants';
import { UserDetailsComponent } from './user/user-details/user-details.component';

export const routes: Routes = [
    { path: '', redirectTo: Paths.SIGN_IN, pathMatch: 'full' },
    // when we have localhost:4200/{path}, it routes us to user.component.html
    { 
        path: '', 
        component: UserComponent, 
        // in UserComponent, to route properly, we add children (in html there are router-outelts)
        // we define next routes ie. /{path}/signup
        children : [
            { path: Paths.SIGN_UP, component: RegistrationComponent },
            { path: Paths.SIGN_IN, component: LoginComponent }
        ]
    },
    // canActivate is from auth.guard, so we can manage the access to this component/view
    {
        path: '', component: MainLayoutComponent, canActivate: [authGuard], 
        canActivateChild: [authGuard],
        children: [
            { path: Paths.DASHBOARD, component: DashboardComponent },
            { 
                path: Paths.ADMIN_ONLY, component: AdminOnlyComponent, 
                data: { claimReq: claimReq.adminOnly } 
            },
            { path: Paths.USER_DETAILS, component: UserDetailsComponent },
            { path: Paths.PAYMENT, component: PaymentsComponent },
            { path: Paths.FORBIDDEN, component: ForbiddenComponent }
        ]
    }    
];
