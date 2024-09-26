import { Routes } from '@angular/router';
import { LayoutComponent } from './core/components/layout/layout.component';
import { UsersComponent } from './features/users/users.component';
import { HomeComponent } from './features/home/home.component';
import { AuthGuard } from './core/guard/auth.guard';
import { LoginComponent } from './core/auth/login/login.component';

export const routes: Routes = [
    {
      path: '',
      component: LayoutComponent,
      canActivate: [AuthGuard],
      children: [
        {
            path: 'home',
            component: HomeComponent,
          },
        {
          path: 'users',
          component: UsersComponent,
        },
        
      ],
    },
    {
        path: 'login',
        component: LoginComponent,
    }
  ];
