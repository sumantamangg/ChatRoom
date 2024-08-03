import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Import for forms (choose one)
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { firebaseConfig } from '../environment/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { ChatroomComponent } from './pages/chatroom/chatroom.component';
import { LoginComponent } from './pages/login/login.component';
import { HeaderComponent } from './header/header.component';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { LayoutComponent } from './layout/layout.component';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
//firebase.initializeApp(firebaseConfig.firebase);

@NgModule({
  declarations: [
    AppComponent,
    ChatroomComponent,
    LoginComponent,
    HeaderComponent,
    LayoutComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatInputModule,
    FormsModule ,
    MatCardModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(firebaseConfig.firebase), // Initialize Firebase with firebaseConfig
    AngularFireAuthModule,
  ],
  providers: [],
  exports: [
  ],
  bootstrap: [AppComponent]

})
export class AppModule { }
