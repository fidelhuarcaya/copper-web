import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideNebularTheme } from './nebular-config';
import { provideAnimations } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { NbThemeModule } from '@nebular/theme';
import { CDK_TABLE, CdkTableModule } from '@angular/cdk/table';
import { providePrimeNgTheme } from './primeng-config';
import { TokenInterceptor } from './core/interceptor/token.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideNebularTheme(),
    providePrimeNgTheme(),
    provideHttpClient(),
    importProvidersFrom(NbThemeModule.forRoot()),
    { provide: CDK_TABLE, useValue: CdkTableModule },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },

  ],
};
