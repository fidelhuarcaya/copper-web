import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { error } from 'console';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { NbToastrService } from '@nebular/theme';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule, CheckboxModule], // Include FormsModule
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  remember: boolean = false; // Change data type to boolean


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toastService: NbToastrService,
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      remember: []
    });
  }

  onSubmit() {
    if (!this.loginForm || this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.loginForm.value.username, this.loginForm.value.password)
      .subscribe(
        {
          next: (res) => {
            this.router.navigate(['/home']);

          },
          error: () => {
            this.toastService.danger("Login failed")
          }

        }
      );
  }
}
