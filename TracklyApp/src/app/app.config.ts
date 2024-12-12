import { provideHttpClient, withInterceptors } from "@angular/common/http"
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { provideToastr } from "ngx-toastr"

import { authInterceptor } from './shared/auth.interceptor';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(FormsModule, MatDialogModule),
    provideAnimationsAsync(),
    //by default notifications are shown in top right corner, we move them to center
    //different options are in here: https://www.npmjs.com/package/ngx-toastr
    provideToastr({positionClass: 'toast-top-center'}), provideAnimationsAsync(), provideAnimationsAsync()
  ]
};
