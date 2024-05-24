import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QueryFn } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrl: './chatroom.component.css'
})
export class ChatroomComponent implements OnInit {

  currentUser: any = null;
  newMessage: string = ''; // Input for new messages
  @ViewChild('messageContainer') private messageContainer?: ElementRef;

  private itemsCollection: AngularFirestoreCollection<any>;
  items: Observable<any[]>;

  constructor(private afs: AngularFirestore, private authService: AuthService) {

    this.authService.currentUser.subscribe(
      userdata =>{
        this.currentUser = userdata;
<<<<<<< Updated upstream
=======
        console.log("machikney "+ this.currentUser.email);
>>>>>>> Stashed changes
      }
    )
    const queryFn: QueryFn = (ref) => ref.orderBy('createdAt', 'asc');

    this.itemsCollection = this.afs.collection<any>('chatRoom', queryFn);
    this.items = this.itemsCollection.valueChanges();
  }

  addItem(item: any) {
    this.itemsCollection.add(item);
  }

  ngOnInit(): void {

  }

  sendMessage() {
    const item = {
      'content': this.newMessage,
      'sender': this.currentUser.email || 'unknown',
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

<<<<<<< Updated upstream
=======
  ownMessage(message: any){
    //console.log("yo yo"+this.currentUser?.email);
    return message?.sender === this.currentUser?.email;
  }
  

>>>>>>> Stashed changes
}
