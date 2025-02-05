import {Component, inject} from '@angular/core';
import {WebSocketService} from './services/api/web-socket.service';
import {StorageService} from './services/storage/storage.service';
import { ToastrService } from 'ngx-toastr';
import {Router} from '@angular/router';

declare var $: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'vip-logistics';
  private webSocketService = inject(WebSocketService);
  private storageService = inject(StorageService);
  receivedMessages: any[] = [];

  constructor(private toastr: ToastrService, private router: Router) {
  }

  ngOnInit(): void {
    // this.webSocketService.getMessages().subscribe((message) => {
    //   let userRole = this.storageService.getUserRole();
    //   if(userRole == 'MANAGER'){
    //     const toastRef = this.toastr.info(
    //       `<div class="toast-clickable">${message}</div>`,
    //       'Notification Received',
    //       {
    //         enableHtml: true,
    //         closeButton: true,
    //         positionClass: 'toast-bottom-right',
    //         timeOut: 0,
    //         tapToDismiss: false,
    //       }
    //     );
    //     toastRef.onTap.subscribe(() => {
    //       this.storageService.logout();
    //     });
    //
    //     // this.storageService.saveNotification(message);
    //   }
    // });
  }

  ngOnDestroy(): void {
    this.webSocketService.disconnect();
  }

}
