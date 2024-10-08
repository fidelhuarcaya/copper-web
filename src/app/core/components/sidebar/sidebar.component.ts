import { Component } from '@angular/core';
import { NbLayoutModule, NbSidebarModule } from '@nebular/theme';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [NbSidebarModule, NbLayoutModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

}
