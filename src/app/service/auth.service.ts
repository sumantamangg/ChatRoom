import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;

  constructor(private auth: AngularFireAuth  ) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(sessionStorage.getItem('userData')!));
    this.currentUser = this.currentUserSubject.asObservable();
   }

   public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  // function to store userdetail to localStorage
  setUser(data:any) {
    sessionStorage.setItem('userData', JSON.stringify(data.user));
    this.currentUserSubject.next(data.user);
  }

  isLoggedIn(){
    if (sessionStorage.getItem('userData')){
      return true;
    } 
    return false;
  }

  signIn(email: string, password: string) {
    // return this.auth.signInWithEmailAndPassword(email, password);
    return new Observable(subscriber => {
      this.auth.signInWithEmailAndPassword(email, password)
        .then(response => {
          //sessionStorage.setItem('userData', JSON.stringify(response.user));
          this.setUser(response);
          subscriber.next(response);
          subscriber.complete();
        })
        .catch(error => {
          subscriber.error(error);
        })
    })
  }

  signOut() {
    sessionStorage.clear();
    this.currentUserSubject.next(null);
  }

  signUp(email: string, password: string): import("rxjs").Observable<any> {
    return new Observable(subscriber => {
      this.auth.createUserWithEmailAndPassword(email, password)
        .then(response => {
          subscriber.next(response); // Emit the success response
          subscriber.complete(); // Signal completion
        })
        .catch(error => {
          subscriber.error(error); // Emit the error
        });
    });
  }
  
}
