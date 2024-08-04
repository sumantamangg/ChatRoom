import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QueryFn } from '@angular/fire/compat/firestore';
import { BehaviorSubject, fromEvent, map, Observable, Subscription, throttleTime } from 'rxjs';
import { AuthService } from '../../service/auth.service';
import { FirebaseMessage } from '../../models/firebaseMessage.model';
import { FirebaseUser, getDefaultFirebaseUser } from '../../models/firebaseUser.model';


@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrl: './chatroom.component.css'
})
export class ChatroomComponent implements OnInit, OnDestroy, AfterViewChecked, AfterViewInit {

  currentUser: FirebaseUser;
  newMessage: string = ''; // Input for new messages
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  subscription: Subscription;
  private fetchingMore: boolean = false;
  private lastVisibleMessage: any;
  private limit: number = 10;
  shouldSCrollToBottom: boolean = false;

  private itemsCollection!: AngularFirestoreCollection<FirebaseMessage>;
  private itemsSubject: BehaviorSubject<FirebaseMessage[]> = new BehaviorSubject<FirebaseMessage[]>([]);
  items: Observable<FirebaseMessage[]>;
  itemsLoaded: boolean = false;

  constructor(private afs: AngularFirestore, private authService: AuthService) {
    this.currentUser = getDefaultFirebaseUser();
    this.subscription = this.authService.currentUser.subscribe(
      userdata =>{
        this.currentUser = userdata;
      }
    )
    this.items = this.itemsSubject.asObservable();
    this.loadInitialMessages();

  }

  loadInitialMessages(){
    const queryFn: QueryFn = (ref) => ref.orderBy('createdAt', 'desc').limit(this.limit);

    this.itemsCollection = this.afs.collection<any>('chatRoom', queryFn);
    this.itemsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as FirebaseMessage;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ).subscribe(messages => {
      const reversedMessages = messages.reverse();
      this.itemsSubject.next(reversedMessages);
      this.itemsLoaded = true;
      if (reversedMessages.length) {
        this.lastVisibleMessage = reversedMessages[0].createdAt;
      }
      this.shouldSCrollToBottom = true;
      this.scrollToBottom();
    });
  }
  loadMoreMessages() {
    this.fetchingMore = true;
    const queryFn: QueryFn = (ref) => ref.orderBy('createdAt', 'desc').startAfter(this.lastVisibleMessage).limit(this.limit);
    this.afs.collection<FirebaseMessage>('chatRoom', queryFn).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as FirebaseMessage;
        const id = a.payload.doc.id;
        return { id, ...data };
      }))
    ).subscribe(messages => {
      if (messages.length) {
        const currentMessages = this.itemsSubject.value;
        const reversedMessages = messages.reverse();
        this.itemsSubject.next([...reversedMessages, ...currentMessages]);
        this.lastVisibleMessage = reversedMessages[0].createdAt;
      }
      this.fetchingMore = false;
    });
  }
  addItem(item: any) {
    this.itemsCollection.add(item);
  }

  ngOnInit() {
   
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

  ngAfterViewInit(){
    fromEvent(this.messageContainer?.nativeElement, 'scroll')
      .pipe(throttleTime(300)) 
      .subscribe((event: any) => this.onScroll(event));
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    if (this.shouldSCrollToBottom) {
      const container = this.messageContainer?.nativeElement;
      if (container) {
        try {
          container.scrollTop = container.scrollHeight;
        } catch (err) {
          console.error('Error scrolling to bottom:', err);
        }
      }
    }
  }
  
  
  onScroll(event: any): void {
    this.shouldSCrollToBottom = false;
    const top = event.target.scrollTop === 0;
    if (top && this.itemsLoaded) {
      this.loadMoreMessages();
    }
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
