import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { provideHttpClient, withInterceptors } from "@angular/common/http"
import { FormsModule } from '@angular/forms';

// import { provideAnimations } from "@angular/platform-browser/animations"
import { provideToastr } from "ngx-toastr"
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from './shared/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(FormsModule),
    //provideAnimations(),
    provideAnimationsAsync(),
    //by default notifications are shown in top right corner, we move them to center
    //different options are in here: https://www.npmjs.com/package/ngx-toastr
    provideToastr({positionClass: 'toast-top-center'})
  ]
};
