import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { AppRoutes } from '../app.routes';

@Injectable({providedIn: 'root'})

export class AuthGuard {
  constructor(private authService: AuthService,
              private router: Router
  ){}
  canActivate() {
    if (this.authService.currentUserValue) {
      return true;
    }
    this.router.navigate([AppRoutes.Login]);
    return false;
  }
  }

