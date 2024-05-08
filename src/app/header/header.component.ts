import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Route, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {

  currentUser: any = null;
  constructor(private authService: AuthService,
              private router: Router
  ){
    this.authService.currentUser.subscribe(
      userdata =>{
        this.currentUser = userdata;
      }
    )
  }

  logout(){
    this.authService.signOut();
    this.router.navigate(['/login']);
  }
}
