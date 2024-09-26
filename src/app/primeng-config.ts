import { importProvidersFrom } from '@angular/core';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbLayoutModule, NbThemeModule, NbMenuModule, NbSidebarModule, NbDatepickerModule, NbDialogModule, NbToastrModule, NbWindowModule, NbTableModule, NbTreeGridModule } from '@nebular/theme';

export function providePrimeNgTheme() {
  return importProvidersFrom(
    NbThemeModule.forRoot({ name: 'default' }),
  );
}