import { Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { RegistrationComponent } from './user/registration/registration.component';
import { LoginComponent } from './user/login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard } from './shared/auth.guard';
import { AdminOnlyComponent } from './authorizeDemo/admin-only/admin-only.component';
import { AdminOrTeacherComponent } from './authorizeDemo/admin-or-teacher/admin-or-teacher.component';
import { ApplyForMaternityLeaveComponent } from './authorizeDemo/apply-for-maternity-leave/apply-for-maternity-leave.component';
import { LibraryMembersOnlyComponent } from './authorizeDemo/library-members-only/library-members-only.component';
import { Under10AndFemaleComponent } from './authorizeDemo/under10-and-female/under10-and-female.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { claimReq } from './shared/utils/claimReq-utils';
import { PaymentsComponent } from './payments/payments.component';
import { Paths } from './shared/constants';

export const routes: Routes = [
    { path: '', redirectTo: Paths.SIGN_IN, pathMatch: 'full' },
    // when we have localhost:4200/{path}, it routes us to user.component.html
    { 
        path: '', 
        component: UserComponent, 
        // in UserComponent, to route properly, we add children (in html there are router-outelts)
        // we define next routes ie. /{path}}/signup
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
            { 
                path: Paths.ADMIN_OR_TEACHER, component: AdminOrTeacherComponent, 
                data: { claimReq: claimReq.adminOrTeacher } 
            },
            { 
                path: Paths.APPLY_FOR_MATERNITY_LEAVE, component: ApplyForMaternityLeaveComponent, 
                data: { claimReq: claimReq.femaleAndTeacher } 
            },
            { 
                path: Paths.LIBRARY_MEMBERS_ONLY, component: LibraryMembersOnlyComponent, 
                data: { claimReq: claimReq.hasLibraryId } 
            },
            { 
                path: Paths.UNDER10_AND_FEMALE, component: Under10AndFemaleComponent, 
                data: { claimReq: claimReq.femaleAndBelow10 } 
            },
            { path: Paths.PAYMENT, component: PaymentsComponent },
            { path: Paths.FORBIDDEN, component: ForbiddenComponent }
        ]
    }    
];
