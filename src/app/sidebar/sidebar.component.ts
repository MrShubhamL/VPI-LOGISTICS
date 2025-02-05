import {Component, inject, OnInit} from '@angular/core';
import {StorageService} from '../services/storage/storage.service';
import {ApiService} from '../services/api/api.service';
import master_menus from '../services/models/master-sidebar-menus';
import transaction_menus from '../services/models/transaction-sidebar-menus';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements OnInit{
  private storage = inject(StorageService);
  private apiService = inject(ApiService);
  myPermissions: any[] = [];
  userRoles: any;
  myRole: any;

  filteredMasterMenus: any[] = [];
  filteredTransactionMenus: any[] = [];


  filteredTransactionPermissions: any[] = [];
  filteredMasterPermissions: any[] = [];


  ngOnInit(): void {
    this.myRole = this.storage.getUserRole();
    this.apiService.getAllRoles().subscribe(res => {
      this.myPermissions = res;
      this.userRoles = this.myPermissions.flatMap(r => r);
      if (this.myRole === 'SUPER_ADMIN') {
        this.filteredMasterMenus = master_menus;
        this.filteredTransactionMenus = transaction_menus;
        return;
      }


      this.userRoles.forEach((p: any) => {
        if (this.myRole === p.roleName) {
          p.permissions.forEach((up: any) => {
            this.filteredMasterPermissions.push(up.userPermission);
            this.filteredTransactionPermissions.push(up.userPermission);
          });
        }
      });

      this.filteredMasterMenus = master_menus.filter(menu =>
        this.filteredMasterPermissions.includes(menu.permission)
      );

      this.filteredTransactionMenus = transaction_menus.filter(menu =>
        this.filteredTransactionPermissions.includes(menu.permission)
      );
    });
  }

}
