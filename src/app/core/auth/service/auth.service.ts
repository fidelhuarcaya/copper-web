import { inject, Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthResponse } from '../../interfaces/auth.interface';
import { environment } from '../../../../environments/environment';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class AuthService implements OnInit {
  private currentUserSubject: BehaviorSubject<AuthResponse | null>;
  public currentUser: Observable<AuthResponse | null>;

  private router =inject(Router);
   private jwtHelper =inject(JwtHelperService);

  constructor(private http: HttpClient) {
    const storedUser = this.isBrowser() ? localStorage.getItem('currentUser') : null;
    this.currentUserSubject = new BehaviorSubject<AuthResponse | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  public get currentUserValue(): AuthResponse | null {
    return this.currentUserSubject.value;
  }

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.msAuth}/auth/login`, { email: username, password: password })
      .pipe(map(user => {
        if (this.isBrowser() && user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('_t', user.token);
          this.currentUserSubject.next(user);
        }
        return user;
      }));
  }

  isTokenExpired(token: string): boolean {
    return this.jwtHelper.isTokenExpired(token);
  }
  
  logout() {
    if (this.isBrowser()) {
      localStorage.clear();
    }
    this.currentUserSubject.next(null);
    this.router.navigate(['/login'], { queryParams: { message: 'Session expired' } });

  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
