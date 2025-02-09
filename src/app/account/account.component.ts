import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ApiService} from '../services/api/api.service';
import {StorageService} from '../services/storage/storage.service';
declare var $: any;

@Component({
  selector: 'app-account',
  standalone: false,

  templateUrl: './account.component.html',
  styleUrl: './account.component.scss'
})
export class AccountComponent {
  form!: FormGroup;
  account_types: string[] = [
    'cash',
    'bank',
    'party',
    'creditor',
    'debtor',
    'journal',
  ];
  balanceMarks: string[] = ['credit', 'debit'];
  allAccounts: any[] = [];
  filteredAccountData: any[] = [];
  accountData: any[] = [];
  isAccountModalOpen: boolean = false;
  selectedAccountItem: any = null;

  private formBuilder = inject(FormBuilder);
  private apiService = inject(ApiService);
  private storageService = inject(StorageService);

  constructor() {
    this.form = this.formBuilder.group({
      searchQuery: new FormControl(''),
      accountId: new FormControl(''),
      accountNo: new FormControl(''),
      accountType: new FormControl(''),
      accountName: new FormControl(''),
      openingBalance: new FormControl(''),
      balanceMark: new FormControl(''),
      underGroup: new FormControl(''),
    })
  }

  ngOnInit(){
    this.apiService.getAccounts().subscribe(res=>{
      if(res){
        this.allAccounts = res;
      }
    }, err=>{
      console.log(err);
    })
  }


  createAccount(){
    this.apiService.createAccount(this.form.value).subscribe(res=>{
      if(res){
        this.clearForm();
        $.toast({
          heading: 'New Account Created!',
          text: 'You have created new account.',
          showHideTransition: 'fade',
          icon: 'success',
          position: 'bottom-right',
          bgColor: '#1f592c',
          loader: false,
        });
      }
    }, err=>{
      console.log(err)
    })
  }

  updateAccount(){
    console.log(this.form.value)
    this.apiService.updateAccount(this.form.value).subscribe(res=>{
      if(res){
        this.clearForm();
        $.toast({
          heading: 'Account Details Updated!',
          text: 'You have updated account information.',
          showHideTransition: 'fade',
          icon: 'success',
          position: 'bottom-right',
          bgColor: '#1f592c',
          loader: false,
        });
      }
    }, err=>{
      console.log(err)
    })
  }

  deleteAccount(){
    const accountId = this.form.get('accountId')?.value;
    if(accountId){
      this.apiService.deleteAccount(accountId).subscribe(res=>{
        if(res){
          this.clearForm();
          $.toast({
            heading: 'Account Details Deleted!',
            text: 'You have deleted account information.',
            showHideTransition: 'fade',
            icon: 'success',
            position: 'bottom-right',
            bgColor: '#1f592c',
            loader: false,
          });
        }
      }, err=>{
        console.log(err)
      })
    }
  }


  onAccountSearch() {
    const query = (this.form.get('searchQuery')?.value || '')
      .toString()
      .trim()
      .toLowerCase();
    this.filteredAccountData = this.allAccounts.filter(
      (a) =>
        a.accountNo.toLowerCase().includes(query) ||
        a.accountName.toLowerCase().includes(query) ||
        a.accountType.toLowerCase().includes(query)
    );
    this.isAccountModalOpen = query.length > 0 && this.filteredAccountData.length > 0;
  }

  closeModal() {
    this.isAccountModalOpen = false;
    this.selectedAccountItem = null; // Clear the selected item when closing the modal
  }

  selectAccountRow(item: any) {
    this.selectedAccountItem = item;
    this.confirmAccountSelection();
  }

  confirmAccountSelection() {
    if (this.selectedAccountItem) {
      this.form.patchValue({
        accountId: this.selectedAccountItem.accountId,
        accountNo: this.selectedAccountItem.accountNo,
        accountType: this.selectedAccountItem.accountType,
        accountName: this.selectedAccountItem.accountName,
        openingBalance: this.selectedAccountItem.openingBalance,
        balanceMark: this.selectedAccountItem.balanceMark,
        underGroup: this.selectedAccountItem.underGroup,
      });
      this.closeModal();
      this.form.get('searchQuery')?.reset();
    } else {
      alert('No item selected!');
    }
  }


  clearForm(){
    this.form.reset();
    this.ngOnInit();
  }
}
