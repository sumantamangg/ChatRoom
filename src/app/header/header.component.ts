import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Route, Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppRoutes } from '../app.routes';
import { FirebaseUser, getDefaultFirebaseUser } from '../models/firebaseUser.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnDestroy {

  currentUser: FirebaseUser;
  subscription: Subscription;

  constructor(private authService: AuthService,
              private router: Router
  ){
    this.currentUser = getDefaultFirebaseUser();
    this.subscription = this.authService.currentUser.subscribe(
      userdata =>{
        this.currentUser = userdata;
      }
    )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  logout(){
    this.authService.signOut();
    this.router.navigate([AppRoutes.Login]);
  }
}
