import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QueryFn } from '@angular/fire/compat/firestore';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../service/auth.service';
import { FirebaseMessage } from '../../models/firebaseMessage.model';
import { FirebaseUser, getDefaultFirebaseUser } from '../../models/firebaseUser.model';


@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrl: './chatroom.component.css'
})
export class ChatroomComponent implements OnInit, OnDestroy, AfterViewChecked {

  currentUser: FirebaseUser;
  newMessage: string = ''; // Input for new messages
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  subscription: Subscription;

  private itemsCollection: AngularFirestoreCollection<FirebaseMessage>;
  items: Observable<FirebaseMessage[]>;
  itemsLoaded: boolean = false;

  constructor(private afs: AngularFirestore, private authService: AuthService) {
    this.currentUser = getDefaultFirebaseUser();
    this.subscription = this.authService.currentUser.subscribe(
      userdata =>{
        this.currentUser = userdata;
      }
    )

    const queryFn: QueryFn = (ref) => ref.orderBy('createdAt', 'asc');

    this.itemsCollection = this.afs.collection<any>('chatRoom', queryFn);
    this.items = this.itemsCollection.valueChanges();
    this.items.subscribe(() => {
      this.itemsLoaded = true; // Set to true when data is loaded
    });
  }

  addItem(item: any) {
    this.itemsCollection.add(item);
  }

  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  sendMessage() {
    const item = {
      'content': this.newMessage,
      'sender': this.currentUser?.email || 'unknown',
      'createdAt': new Date()
    }
    this.addItem(item);
    this.newMessage = "";
  }

  onEnter(event: any) {
    if (event.key === 'Enter') {
      this.sendMessage();
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.messageContainer!.nativeElement.scrollTop = this.messageContainer?.nativeElement.scrollHeight;
    } catch(err) { }
  }

  ownMessage(message: FirebaseMessage){
    return message?.sender === this.currentUser?.email;
  }
  autoGrow(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    target.style.height = 'auto'; // Reset the height
    target.style.height = target.scrollHeight + 'px'; // Set the height to the scroll height
  }

}
