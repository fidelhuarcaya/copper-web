import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NbButtonModule, NbThemeModule } from '@nebular/theme';
import { NEBULAR_MODULES } from './nebular-imports';
import { PRIMENG_MODULES } from './primeng.imports';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ...NEBULAR_MODULES, ...PRIMENG_MODULES],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'copper';
}
