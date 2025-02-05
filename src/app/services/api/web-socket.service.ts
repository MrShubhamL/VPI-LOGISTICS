import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private readonly socket: any;  // Use 'any' instead of 'WebSocket'
  private readonly stompClient: any;
  private messagesSubject: Subject<any> = new Subject<any>();

  constructor() {
    // Initialize WebSocket and STOMP client
    this.socket = new SockJS('http://localhost:9090/ws');
    this.stompClient = Stomp.over(this.socket);

    // Connect to the STOMP server
    this.stompClient.connect({}, (frame: any) => {
      console.log('Connected: ' + frame);

      // Subscribe to a topic
      this.stompClient.subscribe('/topic/notifications', (message: any) => {
        this.handleMessage(message);
      });
    }, (error: any) => {
      // Handle connection errors here
      console.error('WebSocket connection error: ', error);
    });
  }

  // Observable to listen for messages
  public getMessages(): Observable<any> {
    return this.messagesSubject.asObservable();
  }

  // Send a message
  public sendMessage(destination: string, message: any): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.send(destination, {}, JSON.stringify(message));
    }
  }

  // Handle incoming messages
  private handleMessage(message: any): void {
    this.messagesSubject.next(message.body);
  }

  // Disconnect the WebSocket connection
  public disconnect(): void {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect(() => {
        console.log('Disconnected');
      });
    }
  }
}
