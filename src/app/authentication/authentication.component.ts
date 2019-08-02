import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent {
  loginForm: FormGroup;
  errorMessage: string;

  constructor(
    public authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  tryFacebookLogin() {
    this.authService.doFacebookLogin().then(res => {
      this.router.navigate(['/user']);
    });
  }

  tryTwitterLogin() {
    this.authService.doTwitterLogin().then(res => {
      this.router.navigate(['/user']);
    });
  }

  tryGoogleLogin() {
    this.authService.doGoogleLogin().then(res => {
      this.router.navigate(['/user']);
    });
  }

  tryLogin(value) {
    this.authService.doLogin(value).then(
      res => {
        this.router.navigate(['/user']);
      },
      err => {
        this.errorMessage = err.message;
      }
    );
  }
}
