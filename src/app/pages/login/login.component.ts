import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FirebaseUser, getDefaultFirebaseUser } from '../../models/firebaseUser.model';
import { Subscription } from 'rxjs';
import { AppRoutes } from '../../app.routes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy{

  signupForm: FormGroup;
  formValid: boolean = false;
  signUpActive: boolean = true;
  currentUser: FirebaseUser;
  submitProgress: boolean = false;
  subscription: Subscription;

  constructor(private authService: AuthService,
              private fb: FormBuilder,
              private mSB: MatSnackBar,
              private router: Router
  ) {
    this.currentUser = getDefaultFirebaseUser(); //initilize the currentUser to default empty value
    this.subscription = this.authService.currentUser.subscribe(
      userdata => {
        this.currentUser = userdata;
      }
    );
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
   }

  ngOnInit() { 
    if(this.currentUser) {
      this.router.navigate([AppRoutes.ChatRoom]);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  onSubmit() {
    if (this.signupForm.valid) {
      this.submitProgress = true;
      const email = this.signupForm.get('email')?.value;
      const password = this.signupForm.get('password')?.value;
  
      if (this.signUpActive) {
        this.handleSignUp(email, password);
      } else {
        this.handleSignIn(email, password);
      }
      this.submitProgress = false;
    }
  }
  
  handleSignUp(email: string, password: string) {
    this.authService.signUp(email, password).subscribe({
      next: () => {
        this.mSB.open("Signup success");
      },
      error: (e) => {
        if (e.code === 'auth/email-already-in-use') {
          this.mSB.open('The email address is already in use.', 'dismiss');
        } else {
          this.mSB.open("Something went wrong, please try again later", 'dismiss');
        }
      },
      complete: () => {
        this.resetForm();
      }
    });
  }
  
  handleSignIn(email: string, password: string) {
    this.authService.signIn(email, password).subscribe({
      next: () => {
        this.mSB.open('Login success', 'dismiss');
      },
      error: (e) => {
        if (e.code === "auth/invalid-credential") {
          this.mSB.open("Email and password did not match", "try again");
        } else {
          this.mSB.open("An error occurred during login, please try again later", 'dismiss');
        }
      },
      complete: () => {
        this.router.navigate([AppRoutes.ChatRoom]);
        this.resetForm();
      }
    });
  }
  
  resetForm() {
    this.signupForm.reset();
    this.signUpActive = false;
  }
  

  Switch(){
    this.signUpActive = !this.signUpActive;
    this.signupForm.reset();
  }

  
}
