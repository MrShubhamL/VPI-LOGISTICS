import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../services/api/api.service';
import {StorageService} from '../../services/storage/storage.service';

declare var $: any;

@Component({
  selector: 'app-lorry-receipt',
  standalone: false,
  templateUrl: './lorry-receipt.component.html',
  styleUrls: ['./lorry-receipt.component.scss']
})
export class LorryReceiptComponent {
  form!: FormGroup;
  latestLorryNo: any;
  latestMemoNo: any;
  itemSearchQuery: any = '';
  total_amount: number = 0;
  total_charges_amount: number = 0;
  lrStatus: boolean = false;

  listItemData: any[] = [];
  listChargesData: any[] = [];

  // ----- ITEM SEARCH -----
  filteredItemData: any[] = [];
  itemData: any[] = [];
  isModalOpen: boolean = false;
  selectedItem: any = null;


  // ------ BRANCH SEARCH -------
  filteredBranchData: any[] = [];
  branchData: any[] = [];
  isBranchModalOpen: boolean = false;
  selectedBranchItem: any = null;

  // ------ ROUTE SEARCH -------
  filteredRouteData: any[] = [];
  routeData: any[] = [];
  isRouteModalOpen: boolean = false;
  selectedRouteItem: any = null;

  // ------ PARTY SEARCH -------
  filteredPartyData: any[] = [];
  partyData: any[] = [];
  isPartyModalOpen: boolean = false;
  selectedPartyItem: any = null;

  // ------ VENDOR SEARCH -------
  filteredVendorData: any[] = [];
  vendorData: any[] = [];
  isVendorModalOpen: boolean = false;
  selectedVendorItem: any = null;

  // ------ VENDOR SEARCH -------
  filteredLrData: any[] = [];
  LrData: any[] = [];
  isLrModalOpen: boolean = false;
  selectedLrItem: any = null;


  readEnabled: boolean = false;
  writeEnabled: boolean = false;
  updateEnabled: boolean = false;
  deleteEnabled: boolean = false;
  currentLoggedUser: any;


  formBuilder = inject(FormBuilder);
  apiService = inject(ApiService);
  storageService = inject(StorageService);


  constructor() {
    this.form = this.formBuilder.group({
      lrNo: new FormControl('Loading..'),
      lrSearchQuery: new FormControl(null),

      branch: this.formBuilder.group({
        branchNo: new FormControl(''),
        branchName: new FormControl(''),
      }),

      route: this.formBuilder.group({
        routeNo: new FormControl(''),
        routeName: new FormControl(''),
        gstType: new FormControl(''),
      }),

      party: this.formBuilder.group({
        partyNo: new FormControl(''),
        partyName: new FormControl(''),
      }),

      vendor: this.formBuilder.group({
        vendorId: new FormControl(''),
        vendorCode: new FormControl(''),
        vendorName: new FormControl('')
      }),
      remark: new FormControl(''),
      whoItemList: new FormControl(''),

      memoNo: new FormControl(''),
      octBill: new FormControl(''),

      chalanNo: new FormControl(''),
      chalanDate: new FormControl(''),

      billNo: new FormControl(''),
      billDate: new FormControl(''),

      unloadDate: new FormControl(''),
      memoDate: new FormControl(''),

      lrDate: new FormControl(''),
      refTruckNo: new FormControl(''),

      lorryReceiptItems: this.formBuilder.group({
        lorryReceiptItemId: new FormControl(''),
        item: this.formBuilder.group({
          itemNo: new FormControl(''),
          itemName: new FormControl(''),
          itemDate: new FormControl(''),
          partNo: new FormControl(''),
          qtyInBox: new FormControl(''),
          weightPerBox: new FormControl(''),
          rateOnBox: new FormControl(''),
          rateOnWeight: new FormControl(''),
          pu: new FormControl(''),
        }),
        quantity: new FormControl(''),
        lcvFtl: new FormControl(null),
        calcOn: new FormControl(null),
      }),

      lrNote: new FormControl(''),
      stCharges: new FormControl(''),

      extraCharges: this.formBuilder.group({
        extraChargesId: new FormControl(''),
        chargesHeads: new FormControl(''),
        chargesAmount: new FormControl(''),
      }),

      deliveryAt: new FormControl(''),
      asnNo: new FormControl(''),
      packType: new FormControl(''),
      valueRs: new FormControl(''),
      valueOnChalan: new FormControl(''),

      whoPay: new FormControl(''),
      octroiPay: new FormControl(''),

      totalFreight: new FormControl(''),
      cgst: new FormControl(''),
      sgst: new FormControl(''),
      igst: new FormControl(''),

      grandTotal: new FormControl('', Validators.required),
    });
  }

  ngOnInit() {
    // All Item Data
    this.apiService.getAllItems().subscribe(res => {
      this.itemData = res;
    }, err => {
      console.log(err);
    });

    // All Branch Data
    this.apiService.getBranches().subscribe(res => {
      if (res) {
        this.branchData = res;
      }
    }, error => {
      console.log(error)
    });

    // All Route Data
    this.apiService.getAllRoutes().subscribe(res => {
      if (res) {
        this.routeData = res;
      }
    }, error => {
      console.log(error)
    });

    // All Party Data
    this.apiService.getAllParties().subscribe(res => {
      if (res) {
        this.partyData = res;
      }
    }, error => {
      console.log(error)
    });

    // All Vendor Data
    this.apiService.getAllVendors().subscribe(res => {
      if (res) {
        this.vendorData = res;
      }
    }, error => {
      console.log(error)
    });

    this.apiService.getLatestLorryNo().subscribe(res => {
      if (res) {
        this.latestLorryNo = res;
        this.form.get('lrNo')?.setValue(this.latestLorryNo.newLrNo);
      }
    }, error => {
      console.log(error)
    });

    this.apiService.getLatestMemoNo().subscribe(res => {
      if (res) {
        this.latestMemoNo = res;
        this.form.get('memoNo')?.setValue(this.latestMemoNo.newMemoNo);
      }
    }, error => {
      console.log(error)
    });

    this.apiService.getAllLorries().subscribe(res=>{
      if(res) {
        this.LrData = res;
      }
    }, err=>{
      console.log(err)
    });

    this.storageService.getCurrentUser().subscribe(res => {
      this.currentLoggedUser = res;
      this.currentLoggedUser.roleDto.permissions.map((p: any) => {
        if (p.userPermission == 'ALL_PERMISSIONS') {
          this.readEnabled = true;
          this.writeEnabled = true;
          this.updateEnabled = true;
          this.deleteEnabled = true;
          return;
        }
        if (p.userPermission == 'lorry-receipt') {
          p.privileges.map((pr: any) => {
            if (pr !== null && pr == 'WRITE') {
              this.writeEnabled = true;
            }
            if (pr !== null && pr == 'UPDATE') {
              this.updateEnabled = true;
            }
            if (pr !== null && pr == 'DELETE') {
              this.deleteEnabled = true;
            }
            if (pr !== null && pr == 'READ') {
              this.readEnabled = true;
            }
          });
        }
      });
    }, err => {
      $.toast({
        heading: 'Limited Access Alert!',
        text: 'You dont have modification access on this service! ' + err,
        showHideTransition: 'fade',
        icon: 'info',
        position: 'bottom-right',
        bgColor: '#3152be',
        loader: false,
      });
      this.storageService.logout();
    });

  }

  addCharges() {
    const totalChargesAmount = this.form.get('extraCharges.chargesAmount')?.value;
    this.total_charges_amount += totalChargesAmount;
    const extraCharges = {
      chargesHeads: this.form.get('extraCharges.chargesHeads')?.value,
      chargesAmount: this.form.get('extraCharges.chargesAmount')?.value,
    };
    this.listChargesData.push(extraCharges);
    this.resetChargesArray();
    this.calculateGST();
  }

  removeListCharges(index: number) {
    if (index > -1 && index < this.listChargesData.length) {
      const removedAmount = this.listChargesData[index].chargesAmount;
      this.total_charges_amount -= removedAmount;
      this.listChargesData.splice(index, 1);
      this.calculateGST();
    }
  }

  resetForm() {
    this.form.reset();
    this.ngOnInit();
    this.form.get('item.itemNo')?.enable()
    this.form.get('branch.branchNo')?.enable()
    this.form.get('route.routeNo')?.enable()
    this.form.get('party.partyNo')?.enable()
    this.listItemData = [];
    this.listChargesData = [];
    this.total_amount = 0.0;
    this.total_charges_amount = 0.0;
    this.lrStatus = false;
  }

  addItems() {
    let route = this.form.get('route.routeNo')?.value;
    if(route){
      const totalCalWeight = (this.form.get('lorryReceiptItems.quantity')?.value) * (this.form.get('lorryReceiptItems.item.weightPerBox')?.value);
      const totalCalAmount = totalCalWeight * (this.form.get('lorryReceiptItems.item.rateOnWeight')?.value);
      this.total_amount += totalCalAmount;

      const items = {
        item: {
          itemNo: this.form.get('lorryReceiptItems.item.itemNo')?.value,
          itemName: this.form.get('lorryReceiptItems.item.itemName')?.value,
          weightPerBox: this.form.get('lorryReceiptItems.item.weightPerBox')?.value,
          qtyInBox: this.form.get('lorryReceiptItems.item.qtyInBox')?.value,
          rateOnWeight: this.form.get('lorryReceiptItems.item.rateOnWeight')?.value,
          rateOnBox: this.form.get('lorryReceiptItems.item.rateOnBox')?.value
        },
        quantity: this.form.get('lorryReceiptItems.quantity')?.value,
        lcvFtl: this.form.get('lorryReceiptItems.lcvFtl')?.value,
        calcOn: this.form.get('lorryReceiptItems.calcOn')?.value,
        totalWeight: totalCalWeight,
        amount: totalCalAmount
      }
      this.listItemData.push(items);
      console.log(this.listItemData)
      this.resetItemArray();
      this.calculateGST();
    }else{
      $.toast({
        heading: 'Invalid Route Details!',
        text: 'Please select route before add item list! ',
        showHideTransition: 'fade',
        icon: 'info',
        position: 'bottom-right',
        bgColor: '#3152be',
        loader: false,
      });
    }
  }

  calculateGST(){
    const totalCalculatedAmount = Number(this.total_amount + this.total_charges_amount).toFixed(2);
    let gstType = this.form.get("route.gstType")?.value;
    console.log(totalCalculatedAmount);
    const cgst = 6; // 6%
    const sgst = 6; // 6%
    const igst = 12; // 12%

    let gstAmount = 0;
    let netAmount = 0;
    let cgstAmount = 0;
    let sgstAmount = 0;

    if (gstType === 'in-state') {
      gstAmount = (Number(totalCalculatedAmount) * (cgst + sgst)) / 100;
      cgstAmount = Number(gstAmount)/2;
      sgstAmount = Number(gstAmount)/2;
      netAmount = Number(totalCalculatedAmount) + gstAmount;

      if(this.total_charges_amount == 0){
        this.form.get('totalFreight')?.setValue(this.total_amount.toFixed(2));
      }else{
        this.form.get('totalFreight')?.setValue(Number(totalCalculatedAmount).toFixed(2));
      }
      this.form.get('cgst')?.setValue(cgstAmount.toFixed(2));
      this.form.get('sgst')?.setValue(sgstAmount.toFixed(2));
      this.form.get('igst')?.setValue(0.00);
      this.form.get('grandTotal')?.setValue(netAmount.toFixed(2));
    }
    else if (gstType === 'out-state') {
      gstAmount = (Number(totalCalculatedAmount) * igst) / 100;
      netAmount = Number(totalCalculatedAmount) + gstAmount;

      if(this.total_charges_amount == 0){
        this.form.get('totalFreight')?.setValue(this.total_amount.toFixed(2));
      }else{
        this.form.get('totalFreight')?.setValue(Number(totalCalculatedAmount).toFixed(2));
      }
      this.form.get('cgst')?.setValue(0.00);
      this.form.get('sgst')?.setValue(0.00);
      this.form.get('igst')?.setValue(gstAmount.toFixed(2));
      this.form.get('grandTotal')?.setValue(netAmount.toFixed(2));
    }


  }

  removeListItem(index: number) {
    if (index > -1 && index < this.listItemData.length) {
      const removedAmount = this.listItemData[index].amount;
      this.total_amount -= removedAmount;
      this.listItemData.splice(index, 1);
      this.calculateGST();
    }
  }

  resetItemArray() {
    this.form.get('lorryReceiptItems')?.reset();
  }

  resetChargesArray() {
    this.form.get('extraCharges')?.reset();
  }

  formSubmit() {
    const formObj = {
      lrNo: this.form.get('lrNo')?.value,
      branch: {
        branchNo: this.form.get('branch.branchNo')?.value
      },
      route: {
        routeNo: this.form.get('route.routeNo')?.value,
        gstType: this.form.get('route.gstType')?.value,
      },
      party: {
        partyNo: this.form.get('party.partyNo')?.value
      },
      vendor: {
        vendorId: this.form.get('vendor.vendorId')?.value
      },
      remark: this.form.get('remark')?.value,
      whoItemList: this.form.get('whoItemList')?.value,
      memoNo: this.form.get('memoNo')?.value,
      octBill: this.form.get('octBill')?.value,
      chalanNo: this.form.get('chalanNo')?.value,
      chalanDate: this.form.get('chalanDate')?.value,
      billNo: this.form.get('billNo')?.value,
      billDate: this.form.get('billDate')?.value,
      unloadDate: this.form.get('unloadDate')?.value,
      memoDate: this.form.get('memoDate')?.value,
      lrDate: this.form.get('lrDate')?.value,
      refTruckNo: this.form.get('refTruckNo')?.value,
      lorryReceiptItems: this.listItemData,
      lrNote: this.form.get('lrNote')?.value,
      stCharges: this.form.get('stCharges')?.value,
      extraCharges: this.listChargesData,
      deliveryAt: this.form.get('deliveryAt')?.value,
      asnNo: this.form.get('asnNo')?.value,
      packType: this.form.get('packType')?.value,
      valueRs: this.form.get('valueRs')?.value,
      valueOnChalan: this.form.get('valueOnChalan')?.value,
      whoPay: this.form.get('whoPay')?.value,
      octroiPay: this.form.get('octroiPay')?.value,
      totalFreight: this.form.get('totalFreight')?.value,
      cgst: this.form.get('cgst')?.value,
      sgst: this.form.get('sgst')?.value,
      igst: this.form.get('igst')?.value,
      grandTotal: this.form.get('grandTotal')?.value,
      lrStatus: this.lrStatus
    }
    this.apiService.addLorryReceipt(formObj).subscribe(res=>{
      if(res){
        this.resetForm();
        $.toast({
          heading: 'Lorry Receipt Added!!',
          text: 'You have successfully added new Lorry Receipt.',
          showHideTransition: 'fade',
          icon: 'success',
          position: 'bottom-right',
          bgColor: '#41a918',
          loader: false,
        });
      }
    }, err=>{
      $.toast({
        heading: 'Invalid Information!',
        text: 'Please re-login and try again!!' + err,
        showHideTransition: 'fade',
        icon: 'info',
        position: 'bottom-right',
        bgColor: '#1898a9',
        loader: false,
      });
    });
  }

  updateLr(){
    if(!this.form.invalid){
      const formObj = {
        lrNo: this.form.get('lrNo')?.value,
        branch: {
          branchNo: this.form.get('branch.branchNo')?.value
        },
        route: {
          routeNo: this.form.get('route.routeNo')?.value,
          gstType: this.form.get('route.gstType')?.value,
        },
        party: {
          partyNo: this.form.get('party.partyNo')?.value
        },
        vendor: {
          vendorId: this.form.get('vendor.vendorId')?.value
        },
        remark: this.form.get('remark')?.value,
        whoItemList: this.form.get('whoItemList')?.value,
        memoNo: this.form.get('memoNo')?.value,
        octBill: this.form.get('octBill')?.value,
        chalanNo: this.form.get('chalanNo')?.value,
        chalanDate: this.form.get('chalanDate')?.value,
        billNo: this.form.get('billNo')?.value,
        billDate: this.form.get('billDate')?.value,
        unloadDate: this.form.get('unloadDate')?.value,
        memoDate: this.form.get('memoDate')?.value,
        lrDate: this.form.get('lrDate')?.value,
        refTruckNo: this.form.get('refTruckNo')?.value,
        lorryReceiptItems: this.listItemData,
        lrNote: this.form.get('lrNote')?.value,
        stCharges: this.form.get('stCharges')?.value,
        extraCharges: this.listChargesData,
        deliveryAt: this.form.get('deliveryAt')?.value,
        asnNo: this.form.get('asnNo')?.value,
        packType: this.form.get('packType')?.value,
        valueRs: this.form.get('valueRs')?.value,
        valueOnChalan: this.form.get('valueOnChalan')?.value,
        whoPay: this.form.get('whoPay')?.value,
        octroiPay: this.form.get('octroiPay')?.value,
        totalFreight: this.form.get('totalFreight')?.value,
        cgst: this.form.get('cgst')?.value,
        sgst: this.form.get('sgst')?.value,
        igst: this.form.get('igst')?.value,
        grandTotal: this.form.get('grandTotal')?.value,
        lrStatus: this.lrStatus
      }
      this.apiService.updateLorryReceipt(formObj).subscribe(res=>{
        this.resetForm();
        $.toast({
          heading: 'Lorry Receipt Updated!!',
          text: 'You have successfully updated the LR.',
          showHideTransition: 'fade',
          icon: 'success',
          position: 'bottom-right',
          bgColor: '#41a918',
          loader: false,
        });
      }, err=>{
        $.toast({
          heading: 'Invalid Information!',
          text: 'Please re-login and try again!!' + err,
          showHideTransition: 'fade',
          icon: 'info',
          position: 'bottom-right',
          bgColor: '#1898a9',
          loader: false,
        });
      });
    }
  }

  saveLr(){
    const formObj = {
      lrNo: this.form.get('lrNo')?.value,
      branch: {
        branchNo: this.form.get('branch.branchNo')?.value
      },
      route: {
        routeNo: this.form.get('route.routeNo')?.value,
        gstType: this.form.get('route.gstType')?.value,
      },
      party: {
        partyNo: this.form.get('party.partyNo')?.value
      },
      vendor: {
        vendorId: this.form.get('vendor.vendorId')?.value
      },
      remark: this.form.get('remark')?.value,
      whoItemList: this.form.get('whoItemList')?.value,
      memoNo: this.form.get('memoNo')?.value,
      octBill: this.form.get('octBill')?.value,
      chalanNo: this.form.get('chalanNo')?.value,
      chalanDate: this.form.get('chalanDate')?.value,
      billNo: this.form.get('billNo')?.value,
      billDate: this.form.get('billDate')?.value,
      unloadDate: this.form.get('unloadDate')?.value,
      memoDate: this.form.get('memoDate')?.value,
      lrDate: this.form.get('lrDate')?.value,
      refTruckNo: this.form.get('refTruckNo')?.value,
      lorryReceiptItems: this.listItemData,
      lrNote: this.form.get('lrNote')?.value,
      stCharges: this.form.get('stCharges')?.value,
      extraCharges: this.listChargesData,
      deliveryAt: this.form.get('deliveryAt')?.value,
      asnNo: this.form.get('asnNo')?.value,
      packType: this.form.get('packType')?.value,
      valueRs: this.form.get('valueRs')?.value,
      valueOnChalan: this.form.get('valueOnChalan')?.value,
      whoPay: this.form.get('whoPay')?.value,
      octroiPay: this.form.get('octroiPay')?.value,
      totalFreight: this.form.get('totalFreight')?.value,
      cgst: this.form.get('cgst')?.value,
      sgst: this.form.get('sgst')?.value,
      igst: this.form.get('igst')?.value,
      grandTotal: this.form.get('grandTotal')?.value,
      lrStatus: this.lrStatus
    }
    this.apiService.addLorryReceipt(formObj).subscribe(res=>{
      if(res){
        this.resetForm();
        $.toast({
          heading: 'Lorry Receipt Saved!!',
          text: 'You have successfully saved the LR.',
          showHideTransition: 'fade',
          icon: 'success',
          position: 'bottom-right',
          bgColor: '#41a918',
          loader: false,
        });
      }
    }, err=>{
      $.toast({
        heading: 'Invalid Information!',
        text: 'Please re-login and try again!!' + err,
        showHideTransition: 'fade',
        icon: 'info',
        position: 'bottom-right',
        bgColor: '#1898a9',
        loader: false,
      });
    });
  }

  deleteLr(){
    const lrNo = this.form.get('lrNo')?.value;
    if(lrNo){
      this.apiService.deleteLrReceipt(lrNo).subscribe(res=>{
        if(res){
          this.resetForm();
          $.toast({
            heading: 'Lorry Receipt Deleted!',
            text: 'You have successfully deleted the LR.',
            showHideTransition: 'fade',
            icon: 'success',
            position: 'bottom-right',
            bgColor: '#41a918',
            loader: false,
          });
        }
      }, err=>{
        $.toast({
          heading: 'Invalid Information!',
          text: 'Please re-login and try again!!' + err,
          showHideTransition: 'fade',
          icon: 'info',
          position: 'bottom-right',
          bgColor: '#1898a9',
          loader: false,
        });
      });
    }

  }

  // ---------------------- Item Query Search ----------------------

  onItemSearch() {
    const query = (this.form.get('lorryReceiptItems.item.itemName')?.value || '')
      .toString()
      .trim()
      .toLowerCase();
    this.filteredItemData = this.itemData.filter(
      (i) =>
        i.itemNo.toLowerCase().includes(query) ||
        i.itemName.toLowerCase().includes(query) ||
        i.partNo.toLowerCase().includes(query)
    );
    this.isModalOpen = query.length > 0 && this.filteredItemData.length > 0;
  }

  closeItemModal() {
    this.isModalOpen = false;
    this.selectedItem = null; // Clear the selected item when closing the modal
  }

  selectItemRow(item: any) {
    this.selectedItem = item;
    this.confirmItemSelection();
  }

  confirmItemSelection() {
    if (this.selectedItem) {
      this.form.patchValue({
        lorryReceiptItems: {
          item: {
            itemNo: this.selectedItem.itemNo,
            itemName: this.selectedItem.itemName,
            itemDate: this.selectedItem.itemDate,
            partNo: this.selectedItem.partNo,
            qtyInBox: this.selectedItem.qtyInBox,
            weightPerBox: this.selectedItem.weightPerBox,
            rateOnBox: this.selectedItem.rateOnBox,
            rateOnWeight: this.selectedItem.rateOnWeight,
            pu: this.selectedItem.pu,
          }
        }
      })
      this.closeItemModal();
    } else {
      alert('No item selected!');
    }
  }


  // ---------------------- Branch Query Search ----------------------

  onBranchSearch() {
    const query = (this.form.get('branch.branchNo')?.value || '')
      .toString()
      .trim()
      .toLowerCase();
    this.filteredBranchData = this.branchData.filter(
      (b) =>
        b.branchNo.toLowerCase().includes(query) ||
        b.branchName.toLowerCase().includes(query)
    );
    this.isBranchModalOpen = query.length > 0 && this.filteredBranchData.length > 0;
  }

  closeBranchModal() {
    this.isBranchModalOpen = false;
    this.selectedBranchItem = null; // Clear the selected item when closing the modal
  }

  selectBranchRow(item: any) {
    this.selectedBranchItem = item;
    this.confirmBranchSelection();
  }

  confirmBranchSelection() {
    if (this.selectedBranchItem) {
      this.form.patchValue({
        branch: {
          branchNo: this.selectedBranchItem.branchNo,
          branchName: this.selectedBranchItem.branchName
        }
      });
      this.closeBranchModal();
    } else {
      alert('No item selected!');
    }
  }

  // ---------------------- Route Query Search ----------------------

  onRouteSearch() {
    const query = (this.form.get('route.routeNo')?.value || '').toString().trim().toLowerCase();
    this.filteredRouteData = this.routeData.filter(
      (route) =>
        route.routeNo.toLowerCase().includes(query) ||
        route.routeName.toLowerCase().includes(query)
    );
    this.isRouteModalOpen = query.length > 0 && this.filteredRouteData.length > 0;
  }

  closeRouteModal() {
    this.isRouteModalOpen = false;
    this.selectedRouteItem = null; // Clear the selected item when closing the modal
  }

  selectRouteRow(item: any) {
    this.selectedRouteItem = item;
    this.confirmRouteSelection();
  }

  confirmRouteSelection() {
    if (this.selectedRouteItem) {
      this.form.patchValue({
        route: {
          routeNo: this.selectedRouteItem.routeNo,
          routeName: this.selectedRouteItem.routeName,
          gstType: this.selectedRouteItem.gstType
        }
      });
      this.closeRouteModal();
    } else {
      alert('No item selected!');
    }
  }


  // ------------------- Party Search Query ----------------------

  onPartySearch() {
    const query2 = (this.form.get('party.partyNo')?.value || '').toString().trim().toLowerCase();
    this.filteredPartyData = this.partyData.filter(
      (p) =>
        p.partyNo.toLowerCase().includes(query2) ||
        p.partyName.toLowerCase().includes(query2)
    );
    this.isPartyModalOpen = query2.length > 0 && this.filteredPartyData.length > 0;
  }

  closePartyModal() {
    this.isPartyModalOpen = false;
    this.selectedPartyItem = null; // Clear the selected item when closing the modal
  }

  selectPartyRow(item: any) {
    this.selectedPartyItem = item;
    this.confirmPartySelection();
  }

  confirmPartySelection() {
    if (this.selectedPartyItem) {
      this.form.patchValue({
        party: {
          partyNo: this.selectedPartyItem.partyNo,
          partyName: this.selectedPartyItem.partyName
        }
      });
      this.closePartyModal();
    } else {
      alert('No item selected!');
    }
  }


  // ------------------- Party Search Query ----------------------

  onVendorSearch() {
    const query2 = (this.form.get('vendor.vendorCode')?.value || '').toString().trim().toLowerCase();
    this.filteredVendorData = this.vendorData.filter(
      (v) =>
        v.vendorCode.toLowerCase().includes(query2) ||
        v.vendorName.toLowerCase().includes(query2)
    );
    this.isVendorModalOpen = query2.length > 0 && this.filteredVendorData.length > 0;
  }

  closeVendorModal() {
    this.isVendorModalOpen = false;
    this.selectedVendorItem = null; // Clear the selected item when closing the modal
  }

  selectVendorRow(item: any) {
    this.selectedVendorItem = item;
    this.confirmVendorSelection();
  }

  confirmVendorSelection() {
    if (this.selectedVendorItem) {
      this.form.patchValue({
        vendor: {
          vendorId: this.selectedVendorItem.vendorId,
          vendorCode: this.selectedVendorItem.vendorCode,
          vendorName: this.selectedVendorItem.vendorName
        }
      });
      this.closeVendorModal();
    } else {
      alert('No item selected!');
    }
  }


  onLrSearch() {
    const query3 = (this.form.get('lrSearchQuery')?.value || '')
      .toString()
      .trim()
      .toLowerCase();
    this.filteredLrData = this.LrData.filter(
      (l) =>
        l.lrNo.toLowerCase().includes(query3)
    );
    this.isLrModalOpen = query3.length > 0 && this.filteredLrData.length > 0;
  }

  closeLrModal() {
    this.isLrModalOpen = false;
    this.selectedLrItem = null; // Clear the selected item when closing the modal
  }

  selectLrRow(item: any) {
    this.selectedLrItem = item;
    this.confirmLrSelection();
  }

  confirmLrSelection() {
    if (this.selectedLrItem) {
      if(this.selectedLrItem.lrStatus){
        this.lrStatus = true;
      }

      this.listItemData = this.selectedLrItem.lorryReceiptItems;
      this.listChargesData = this.selectedLrItem.extraCharges;

      this.listItemData.map((p: any) =>{
        this.total_amount += p.amount;
      });

      this.listChargesData.map((c: any) =>{
        this.total_charges_amount += c.chargesAmount;
      });
      this.form.patchValue({
        lrNo: this.selectedLrItem.lrNo,
        branch: { ...this.form.get('branch')?.value, ...this.selectedLrItem.branch },
        route: { ...this.form.get('route')?.value, ...this.selectedLrItem.route },
        party: { ...this.form.get('party')?.value, ...this.selectedLrItem.party },
        vendor: { ...this.form.get('vendor')?.value, ...this.selectedLrItem.vendor },
        remark: this.selectedLrItem.remark,
        whoItemList: this.selectedLrItem.whoItemList,
        memoNo: this.selectedLrItem.memoNo,
        octBill: this.selectedLrItem.octBill,
        chalanNo: this.selectedLrItem.chalanNo,
        chalanDate: this.selectedLrItem.chalanDate,
        billNo: this.selectedLrItem.billNo,
        billDate: this.selectedLrItem.billDate,
        unloadDate: this.selectedLrItem.unloadDate,
        memoDate: this.selectedLrItem.memoDate,
        lrDate: this.selectedLrItem.lrDate,
        refTruckNo: this.selectedLrItem.refTruckNo,
        lorryReceiptItems: this.selectedLrItem.lorryReceiptItems,
        lrNote: this.selectedLrItem.lrNote,
        stCharges: this.selectedLrItem.stCharges,
        extraCharges: this.selectedLrItem.extraCharges,
        deliveryAt:  this.selectedLrItem.deliveryAt,
        asnNo:  this.selectedLrItem.asnNo,
        packType:  this.selectedLrItem.packType,
        valueRs:  this.selectedLrItem.valueRs,
        valueOnChalan:  this.selectedLrItem.valueOnChalan,
        whoPay:  this.selectedLrItem.whoPay,
        octroiPay:  this.selectedLrItem.octroiPay,
        totalFreight:  Number(this.total_amount + this.total_charges_amount).toFixed(2),
        cgst:  this.selectedLrItem.cgst,
        sgst:  this.selectedLrItem.sgst,
        igst:  this.selectedLrItem.igst,
        grandTotal:  this.selectedLrItem.grandTotal,
      });
      this.closeLrModal();
    } else {
      alert('No item selected!');
    }
  }


}
