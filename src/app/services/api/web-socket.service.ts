import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private stompClient!: Client;
  private messagesSubject: Subject<any> = new Subject<any>();

  constructor() {
    this.initializeWebSocketConnection();
  }

  private initializeWebSocketConnection(): void {
    const socket = new SockJS('https://viplogistics.org/notify-app/ws');

    this.stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    });

    this.stompClient.onConnect = (frame) => {
      console.log('Connected: ', frame);
      this.stompClient.subscribe('/topic/notifications', (message: IMessage) => {
        this.handleMessage(message);
      });
    };

    this.stompClient.activate();
  }

  public getMessages(): Observable<any> {
    return this.messagesSubject.asObservable();
  }

  private handleMessage(message: IMessage): void {
    this.messagesSubject.next(JSON.parse(message.body));
  }

  // ✅ Send message method
  public sendMessage(destination: string, message: any, messageFor: string): void {
    if (this.stompClient && this.stompClient.active) {
      const payload = {
        ...message,
        messageFor, // Add the recipient or target of the message
      };
      this.stompClient.publish({
        destination: destination,
        body: JSON.stringify(payload),
      });
    } else {
      console.error('WebSocket is not connected.');
    }
  }

  public disconnect(): void {
    if (this.stompClient && this.stompClient.active) {
      this.stompClient.deactivate();
      console.log('Disconnected');
    }
  }
}
