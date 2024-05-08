import { Routes, mapToCanActivate } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ChatroomComponent } from './pages/chatroom/chatroom.component';
import { AuthGuard } from './service/AuthGuard';

export const routes: Routes = [
    {path: '', redirectTo:'login', pathMatch: 'full'},
    {path: 'login', component: LoginComponent},
    {path: 'chatroom', component: ChatroomComponent, 
        canActivate:mapToCanActivate([AuthGuard])}
];
