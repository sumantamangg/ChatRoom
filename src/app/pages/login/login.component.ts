import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  signupForm!: FormGroup;
  formValid: boolean = false;
  signUpActive: boolean = true;
  currentUser: any = null;

  constructor(private authService: AuthService,
              private fb: FormBuilder,
              private mSB: MatSnackBar,
              private router: Router
  ) {
    this.authService.currentUser.subscribe(
      userdata => {
        this.currentUser = userdata;
      }
    );
   }

  ngOnInit() { 
    if(this.currentUser) {
      this.router.navigate(['/chatroom']);
    }

    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  onSubmit() {
    if (this.signupForm.valid && this.signUpActive){
      const email = this.signupForm.get('email')?.value;
      const password = this.signupForm.get('password')?.value;
       
      this.authService.signUp(email, password)
        .subscribe({
          next: () =>{
            this.mSB.open("Signup success");
          },
          error: (e) => {
            if (e.code === 'auth/email-already-in-use') {
              this.mSB.open('The email address is already in use.', 'dismiss'); // Set user-friendly message
            } else {
              this.mSB.open("something happened", 'dismiss'); // Handle other errors
            }
          },
          complete: () => {
            this.signupForm.reset();
            this.signUpActive = false;
          }
        })
    } 
    else if (this.signupForm.valid && !this.signUpActive){
      const email = this.signupForm.get('email')?.value;
      const password = this.signupForm.get('password')?.value;

      this.authService.signIn(email, password)
        .subscribe({
          next: ()=> this.mSB.open('Login success', 'dismiss'),
          error: (e) => {
            if (e.code == "auth/invalid-credential"){
              this.mSB.open("Email and password did not match", "try again");
            }
          },
          complete: ()=>{
            this.signupForm.reset();
            this.router.navigate(["/chatroom"]);
          }
        })
    }
  }

  Switch(){
    this.signUpActive = !this.signUpActive;
    this.signupForm.reset();
  }
}
