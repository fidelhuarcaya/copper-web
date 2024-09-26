import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthResponse } from '../../interfaces/auth.interface';

@Injectable({ providedIn: 'root' })
export class AuthService implements OnInit {
  private currentUserSubject: BehaviorSubject<AuthResponse | null>;
  public currentUser: Observable<AuthResponse | null>;

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

  login(username: string, password: string) {
    return this.http.post<any>(`/api/login`, { username, password })
      .pipe(map(user => {
        if (this.isBrowser() && user && user.token) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
        return user;
      }));
  }

  logout() {
    if (this.isBrowser()) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }
}
