import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NbLayoutModule, NbMenuItem, NbMenuModule, NbSidebarModule, NbSidebarService } from '@nebular/theme';
import { NEBULAR_MODULES } from '../../../nebular-imports';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    NbLayoutModule,
    NbSidebarModule,
    ...NEBULAR_MODULES,
    NbMenuModule,
  
    HeaderComponent,
    FooterComponent,
    SidebarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
  providers: []
})
export class LayoutComponent {
  menu: NbMenuItem[] = [
    {
      title: 'Inicio',
      icon: 'home-outline',
      link: '/home',
      home: true,
    },{
      title: 'Usuarios',
      icon: 'people-outline',
      children: [
        {
          title: 'Lista de Usuarios',
          link: '/users',
        },
      ],
    },
    {
      title: 'Configuraciones',
      icon: 'settings-outline',
      link: '/settings',
    },
  ];

  isSidebarExpanded = true; // Variable para rastrear el estado del sidebar

  constructor(private sidebarService: NbSidebarService) {}

  toggleSidebar(event: Event) {
    event.preventDefault(); // Prevenir la recarga de la página
    this.sidebarService.toggle(true);
  }

  // Detecta el cambio de estado del sidebar
  onSidebarToggle(state: string) {
    this.isSidebarExpanded = state === 'expanded'; // Verifica si el sidebar está expandido
  }
  toggle() {
    this.sidebarService.toggle(true);
    return false;
  }
}
