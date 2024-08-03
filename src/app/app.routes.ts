import { Routes, mapToCanActivate } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { ChatroomComponent } from './pages/chatroom/chatroom.component';
import { AuthGuard } from './service/AuthGuard';

export enum AppRoutes {
    Login = 'login',
    ChatRoom = 'chatroom',
}

export const routes: Routes = [
    {path: '', redirectTo:AppRoutes.Login, pathMatch: 'full'},
    {path: AppRoutes.Login, component: LoginComponent},
    {path: AppRoutes.ChatRoom, component: ChatroomComponent, 
        canActivate:mapToCanActivate([AuthGuard])}
];
