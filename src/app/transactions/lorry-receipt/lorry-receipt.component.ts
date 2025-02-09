import {Component, inject} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ApiService} from '../../services/api/api.service';
import {StorageService} from '../../services/storage/storage.service';
import {WebSocketService} from '../../services/api/web-socket.service';
import {map, Observable, startWith} from 'rxjs';

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
  lastMemoNo: any;

  isMemoFound: boolean = false;

  itemSearchQuery: any = '';
  total_amount: number = 0;
  total_charges_amount: number = 0;
  currentRole: any = '';
  listItemData: any[] = [];
  listChargesData: any[] = [];
  listVehicleData: any[] = [];

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

  // ------ PARTY SEARCH -------
  filteredPartyData2: any[] = [];
  partyData2: any[] = [];
  isPartyModalOpen2: boolean = false;
  selectedPartyItem2: any = null;

  // ------ VENDOR SEARCH -------
  filteredLrData: any[] = [];
  LrData: any[] = [];
  isLrModalOpen: boolean = false;
  selectedLrItem: any = null;

  // ------ VEHICLE SEARCH -------
  filteredVehicleData: any[] = [];
  vehicleData: any[] = [];
  isVehicleModalOpen: boolean = false;
  selectedVehicleItem: any = null;


  readEnabled: boolean = false;
  writeEnabled: boolean = false;
  updateEnabled: boolean = false;
  deleteEnabled: boolean = false;
  currentLoggedUser: any;


  formBuilder = inject(FormBuilder);
  apiService = inject(ApiService);
  storageService = inject(StorageService);
  webSocketService = inject(WebSocketService);

  placeholders = {
    latestLorryNo: '',
    latestMemoNo: ''
  }

  constructor() {
    this.form = this.formBuilder.group({
      lrId: new FormControl(""),
      lrNo: new FormControl("", Validators.required),
      lrSearchQuery: new FormControl(""),
      branch: this.formBuilder.group({
        branchNo: new FormControl("", Validators.required),
        branchName: new FormControl(""),
      }),
      route: this.formBuilder.group({
        routeNo: new FormControl("", Validators.required),
        routeName: new FormControl(""),
        gstType: new FormControl(""),
      }),
      consignor: this.formBuilder.group({
        partyNo: new FormControl("", Validators.required),
        partyName: new FormControl(""),
      }),
      consignee: this.formBuilder.group({
        partyNo: new FormControl("", Validators.required),
        partyName: new FormControl(""),
      }),
      remark: new FormControl(""),
      whoItemList: new FormControl(""),
      octBill: new FormControl(""),
      lrDate: new FormControl(""),
      toPay: new FormControl(""),
      whoPay: new FormControl(""),
      octroiPay: new FormControl(""),
      refTruckNo: new FormControl(""),
      lorryReceiptItems: this.formBuilder.group({
        item: this.formBuilder.group({
          itemNo: new FormControl(""),
          itemName: new FormControl(""),
          itemDate: new FormControl(""),
          partNo: new FormControl(""),
          qtyInBox: new FormControl(""),
          weightPerBox: new FormControl(""),
          rateOnBox: new FormControl(""),
          rateOnWeight: new FormControl(""),
          pu: new FormControl(""),
          vendorCode: new FormControl(""),
        }),
        quantity: new FormControl(""),
        lcvFtl: new FormControl(""),
        calcOn: new FormControl("WEIGHT"),
        totalWeight: new FormControl(""),
        amount: new FormControl(""),
      }),
      extraCharges: this.formBuilder.group({
        extraChargesId: new FormControl(""),
        chargesHeads: new FormControl(""),
        chargesAmount: new FormControl(""),
      }),
      memo: this.formBuilder.group({
        memoId: new FormControl(""),
        memoNo: new FormControl("", Validators.required),
        memoDate: new FormControl(""),
        memoStatus: true
      }),
      chalan: this.formBuilder.group({
        chalanId: new FormControl(""),
        chalanNo: new FormControl("", Validators.required),
        chalanDate: new FormControl(""),
        valueOnChalan: new FormControl(""),
      }),
      bill: this.formBuilder.group({
        billId: new FormControl(""),
        billNo: new FormControl(""),
        billDate: new FormControl(""),
        unloadDate: new FormControl(""),
      }),
      finalTotal: new FormControl(""),
      cgst: new FormControl(""),
      sgst: new FormControl(""),
      igst: new FormControl(""),
      totalFreight: new FormControl(""),
      grandTotal: new FormControl(""),
      deliveryAt: new FormControl(""),
      packType: new FormControl("select"),
      asnNo: new FormControl(""),
      valueRs: new FormControl(""),
      lrNote: new FormControl(""),
      stCharges: new FormControl(""),
      lrStatus: true
    })
  }

  ngOnInit() {
    this.currentRole = this.storageService.getUserRole();
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
        this.partyData2 = res;
      }
    }, error => {
      console.log(error)
    });

    this.apiService.getLatestLorryNo().subscribe(res => {
      if (res) {
        this.latestLorryNo = res;
        this.placeholders.latestLorryNo = this.latestLorryNo.newLrNo;
      }
    }, error => {
      console.log(error)
    });

    this.apiService.getLatestMemoNo().subscribe(res => {
      if (res) {
        this.lastMemoNo = res;
        this.placeholders.latestMemoNo = this.lastMemoNo.lastMemoNo;
      }
    }, error => {
      console.log(error)
    });

    this.apiService.getAllVehicles().subscribe(res => {
      if (res) {
        this.listVehicleData= res;
        console.log(this.listVehicleData)
      }
    }, err => {
      console.log(err)
    });

    this.apiService.getAllLorries().subscribe(res => {
      if (res) {
        this.LrData = res;
        console.log(this.LrData)
      }
    }, err => {
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
      extraChargesId: this.form.get('extraCharges.extraChargesId')?.value,
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
    this.form.get("memo.memoNo")?.enable();
    this.form.get('lrNo')?.enable();
    this.form.get('lorryReceiptItems.calcOn')?.setValue('WEIGHT')
    this.form.get('packType')?.setValue('select')
    this.listItemData = [];
    this.listChargesData = [];
    this.total_amount = 0.0;
    this.total_charges_amount = 0.0;
    this.isMemoFound = false;
  }

  addItems() {
    let route = this.form.get('route.routeNo')?.value;
    if (route) {
      let totalCalWeight = (this.form.get('lorryReceiptItems.quantity')?.value) * (this.form.get('lorryReceiptItems.item.weightPerBox')?.value);
      let totalCalAmount = totalCalWeight * (this.form.get('lorryReceiptItems.item.rateOnWeight')?.value);
      let calOn = this.form.get('lorryReceiptItems.calcOn')?.value;
      if (calOn != 'WEIGHT') {
        totalCalAmount = 0.00
      }
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
      this.resetItemArray();
      this.calculateGST();
    } else {
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

  transformToUppercase(event: any) {
    event.target.value = event.target.value.toUpperCase();
  }

  recalculateGST(event: any) {
    this.total_amount = Number(event.target.value);
    this.calculateGST();
  }

  calculateGST() {
    const totalCalculatedAmount = Number(this.total_amount + this.total_charges_amount).toFixed(2);
    let gstType = this.form.get("route.gstType")?.value;
    const cgst = 6; // 6%
    const sgst = 6; // 6%
    const igst = 12; // 12%

    let gstAmount = 0;
    let netAmount = 0;
    let cgstAmount = 0;
    let sgstAmount = 0;

    if (gstType === 'in-state') {
      gstAmount = (Number(totalCalculatedAmount) * (cgst + sgst)) / 100;
      cgstAmount = Number(gstAmount) / 2;
      sgstAmount = Number(gstAmount) / 2;
      netAmount = Number(totalCalculatedAmount) + gstAmount;

      if (this.total_charges_amount == 0) {
        this.form.get('totalFreight')?.setValue(this.total_amount.toFixed(2));
      } else {
        this.form.get('totalFreight')?.setValue(Number(totalCalculatedAmount).toFixed(2));
      }
      this.form.get('cgst')?.setValue(cgstAmount.toFixed(2));
      this.form.get('sgst')?.setValue(sgstAmount.toFixed(2));
      this.form.get('igst')?.setValue(0.00);
      this.form.get('grandTotal')?.setValue(netAmount.toFixed(2));
    } else if (gstType === 'out-state') {
      gstAmount = (Number(totalCalculatedAmount) * igst) / 100;
      netAmount = Number(totalCalculatedAmount) + gstAmount;

      if (this.total_charges_amount == 0) {
        this.form.get('totalFreight')?.setValue(this.total_amount.toFixed(2));
      } else {
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
    this.form.get('lorryReceiptItems.calcOn')?.setValue('WEIGHT')
  }

  resetChargesArray() {
    this.form.get('extraCharges')?.reset();
  }

  updateLr() {
    if (!this.form.invalid) {
      const formObj = {
        lrId: this.form.get('lrId')?.value,
        lrNo: this.form.get('lrNo')?.value,
        branch: {
          branchNo: this.form.get('branch.branchNo')?.value
        },
        route: {
          routeNo: this.form.get('route.routeNo')?.value,
        },
        consignor: {
          partyNo: this.form.get('consignor.partyNo')?.value
        },
        consignee: {
          partyNo: this.form.get('consignee.partyNo')?.value
        },
        remark: this.form.get('remark')?.value,
        whoItemList: this.form.get('whoItemList')?.value,
        octBill: this.form.get('octBill')?.value,
        lrDate: this.form.get('lrDate')?.value,
        whoPay: this.form.get('whoPay')?.value,
        octroiPay: this.form.get('octroiPay')?.value,
        refTruckNo: this.form.get('refTruckNo')?.value,
        lorryReceiptItems: this.listItemData,
        extraCharges: this.listChargesData,
        memo: {
          memoId: this.form.get('memo.memoId')?.value,
          memoNo: this.form.get('memo.memoNo')?.value,
          memoDate: this.form.get('memo.memoDate')?.value,
        },
        chalan: {
          chalanId: this.form.get('chalan.chalanId')?.value,
          chalanNo: this.form.get('chalan.chalanNo')?.value,
          chalanDate: this.form.get('chalan.chalanDate')?.value,
          valueOnChalan: this.form.get('chalan.valueOnChalan')?.value
        },
        bill: {
          billId: this.form.get('bills.billId')?.value,
          billNo: this.form.get('bills.billNo')?.value,
          billDate: this.form.get('bills.billDate')?.value,
          unloadDate: this.form.get('unloadDate')?.value,
        },
        lrNote: this.form.get('lrNote')?.value,
        stCharges: this.form.get('stCharges')?.value,
        deliveryAt: this.form.get('deliveryAt')?.value,
        asnNo: this.form.get('asnNo')?.value,
        packType: this.form.get('packType')?.value,
        valueRs: this.form.get('valueRs')?.value,
        totalFreight: this.form.get('totalFreight')?.value,
        cgst: this.form.get('cgst')?.value,
        sgst: this.form.get('sgst')?.value,
        igst: this.form.get('igst')?.value,
        grandTotal: this.form.get('grandTotal')?.value,
        lrStatus: false
      }

      this.apiService.updateLorryReceipt(formObj).subscribe(res => {
        if (res) {
          this.resetForm();
          let message = "New LR Update Request!!,  New Lorry Receipt Update Request is Coming..";
          this.webSocketService.sendMessage('/app/sendMessage', message, 'LR-UPDATE-REQUEST');
          $.toast({
            heading: 'Lorry Receipt Updated!!',
            text: 'You have successfully updated the LR.',
            showHideTransition: 'fade',
            icon: 'success',
            position: 'bottom-right',
            bgColor: '#41a918',
            loader: false,
          });
        }
      }, err => {
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

  saveLr() {
    const formObj = {
      lrNo: this.form.get('lrNo')?.value,
      branch: {
        branchNo: this.form.get('branch.branchNo')?.value
      },
      route: {
        routeNo: this.form.get('route.routeNo')?.value,
      },
      consignor: {
        partyNo: this.form.get('consignor.partyNo')?.value
      },
      consignee: {
        partyNo: this.form.get('consignee.partyNo')?.value
      },
      remark: this.form.get('remark')?.value,
      whoItemList: this.form.get('whoItemList')?.value,
      octBill: this.form.get('octBill')?.value,
      lrDate: this.form.get('lrDate')?.value,
      whoPay: this.form.get('whoPay')?.value,
      octroiPay: this.form.get('octroiPay')?.value,
      refTruckNo: this.form.get('refTruckNo')?.value,
      lorryReceiptItems: this.listItemData,
      extraCharges: this.listChargesData,
      memo: {
        memoDate: this.form.get('memo.memoDate')?.value,
        memoNo: this.form.get('memo.memoNo')?.value,
      },
      chalan: {
        chalanNo: this.form.get('chalan.chalanNo')?.value,
        chalanDate: this.form.get('chalan.chalanDate')?.value,
        valueOnChalan: this.form.get('chalan.valueOnChalan')?.value
      },
      bill: {
        billNo: this.form.get('bills.billNo')?.value,
        billDate: this.form.get('bills.billDate')?.value,
        unloadDate: this.form.get('unloadDate')?.value,
      },
      lrNote: this.form.get('lrNote')?.value,
      stCharges: this.form.get('stCharges')?.value,
      deliveryAt: this.form.get('deliveryAt')?.value,
      asnNo: this.form.get('asnNo')?.value,
      packType: this.form.get('packType')?.value,
      valueRs: this.form.get('valueRs')?.value,
      totalFreight: this.form.get('totalFreight')?.value,
      cgst: this.form.get('cgst')?.value,
      sgst: this.form.get('sgst')?.value,
      igst: this.form.get('igst')?.value,
      grandTotal: this.form.get('grandTotal')?.value,
      lrStatus: false
    }

    this.apiService.addLorryReceipt(formObj).subscribe(res => {
      if (res) {
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
    }, err => {
      console.log(err);
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

  deleteLr() {
    const lrId = this.form.get('lrId')?.value;
    if (lrId) {
      this.apiService.deleteLrReceipt(lrId).subscribe(res => {
        if (res) {
          this.resetForm();
          if (this.currentRole != 'SUPER_ADMIN') {
            let message = "LR Deleted!!,  Lorry Receipt is Deleted.";
            this.webSocketService.sendMessage('/app/sendMessage', message, 'LR-REQUEST');
          }
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
      }, err => {
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

  isMemoNoExisted(event: any) {
    const memoNo = event.target.value;
    this.apiService.isMemoExisted(memoNo).subscribe(res => {
      if (res) {
        this.isMemoFound = true;
        this.form.get("memo.memoNo")?.disable();
        $.toast({
          heading: 'Memo Record Found!!',
          text: 'This memo is found in our record!!',
          showHideTransition: 'fade',
          icon: 'info',
          position: 'bottom-right',
          bgColor: '#1898a9',
          loader: false,
        });
      }
    }, err => {
      console.log(err)
    })
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
    const query2 = (this.form.get('consignee.partyNo')?.value || '').toString().trim().toLowerCase();
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
        consignee: {
          partyNo: this.selectedPartyItem.partyNo,
          partyName: this.selectedPartyItem.partyName
        }
      });
      this.closePartyModal();
    } else {
      alert('No item selected!');
    }
  }

  // ------------------- Party 2 Search Query ----------------------


  onPartySearch2() {
    const query2 = (this.form.get('consignor.partyNo')?.value || '').toString().trim().toLowerCase();
    this.filteredPartyData2 = this.partyData2.filter(
      (p) =>
        p.partyNo.toLowerCase().includes(query2) ||
        p.partyName.toLowerCase().includes(query2)
    );
    this.isPartyModalOpen2 = query2.length > 0 && this.filteredPartyData2.length > 0;
  }

  closePartyModal2() {
    this.isPartyModalOpen2 = false;
    this.selectedPartyItem2 = null; // Clear the selected item when closing the modal
  }

  selectPartyRow2(item: any) {
    this.selectedPartyItem2 = item;
    this.confirmPartySelection2();
  }

  confirmPartySelection2() {
    if (this.selectedPartyItem2) {
      console.log(this.selectedPartyItem2)
      this.form.patchValue({
        consignor: {
          partyNo: this.selectedPartyItem2.partyNo,
          partyName: this.selectedPartyItem2.partyName
        }
      });
      this.closePartyModal2();
    } else {
      alert('No item selected!');
    }
  }

  // ------------ LR Search Query ------------------

  onLrSearch() {
    const query3 = (this.form.get('lrSearchQuery')?.value || '')
      .toString()
      .trim()
      .toLowerCase();
    this.filteredLrData = this.LrData.filter(
      (l) =>
        l.lrNo.toLowerCase().includes(query3) ||
        l.memo.memoNo.toLowerCase().includes(query3) ||
        l.consignor.partyName.toLowerCase().includes(query3) ||
        l.consignee.partyName.toLowerCase().includes(query3)
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
      this.listItemData = this.selectedLrItem.lorryReceiptItems;
      this.listChargesData = this.selectedLrItem.extraCharges;
      this.listItemData.map((p: any) => {
        this.total_amount += p.amount;
      });
      this.listChargesData.map((c: any) => {
        this.total_charges_amount += c.chargesAmount;
      });
      this.form.patchValue({
        lrId: this.selectedLrItem.lrId,
        lrNo: this.selectedLrItem.lrNo,
        branch: {...this.form.get('branch')?.value, ...this.selectedLrItem.branch},
        route: {...this.form.get('route')?.value, ...this.selectedLrItem.route},
        consignee: {...this.form.get('consignee')?.value, ...this.selectedLrItem.consignee},
        consignor: {...this.form.get('consignor')?.value, ...this.selectedLrItem.consignor},
        remark: this.selectedLrItem.remark,
        whoItemList: this.selectedLrItem.whoItemList,
        memo: {...this.form.get('memo')?.value, ...this.selectedLrItem.memo},
        octBill: this.selectedLrItem.octBill,
        chalan: {...this.form.get('chalan')?.value, ...this.selectedLrItem.chalan},
        bills: {...this.form.get('bills')?.value, ...this.selectedLrItem.bills},
        unloadDate: this.selectedLrItem.unloadDate,
        lrDate: this.selectedLrItem.lrDate,
        refTruckNo: this.selectedLrItem.refTruckNo,
        lorryReceiptItems: {...this.form.get('lorryReceiptItems')?.value, ...this.selectedLrItem.lorryReceiptItems},
        lrNote: this.selectedLrItem.lrNote,
        stCharges: this.selectedLrItem.stCharges,
        extraCharges: this.selectedLrItem.extraCharges,
        deliveryAt: this.selectedLrItem.deliveryAt,
        asnNo: this.selectedLrItem.asnNo,
        packType: this.selectedLrItem.packType,
        valueRs: this.selectedLrItem.valueRs,
        whoPay: this.selectedLrItem.whoPay,
        octroiPay: this.selectedLrItem.octroiPay,
        totalFreight: Number(this.total_amount + this.total_charges_amount).toFixed(2),
        cgst: this.selectedLrItem.cgst,
        sgst: this.selectedLrItem.sgst,
        igst: this.selectedLrItem.igst,
        grandTotal: this.selectedLrItem.grandTotal,
      });
      this.closeLrModal();
      this.form.get('lrNo')?.disable();
      this.form.get('memo.memoNo')?.disable();
    } else {
      alert('No item selected!');
    }
  }



  // ------------ Vehicle Search Query ------------------

  onVehicleSearch() {
    const query3 = (this.form.get('refTruckNo')?.value || '')
      .toString()
      .trim()
      .toLowerCase();
    this.filteredVehicleData = this.listVehicleData.filter(
      (v) =>
        v.vehicleNumber.toLowerCase().includes(query3) ||
        v.driverName.toLowerCase().includes(query3)
    );
    this.isVehicleModalOpen = query3.length > 0 && this.filteredVehicleData.length > 0;
  }

  closeVehicleModal() {
    this.isVehicleModalOpen = false;
    this.selectedVehicleItem = null;
  }

  selectVehicleRow(item: any) {
    this.selectedVehicleItem = item;
    this.confirmVehicleSelection();
  }

  confirmVehicleSelection() {
    if (this.selectedVehicleItem) {
      this.form.patchValue({
        refTruckNo: this.selectedVehicleItem.vehicleNumber
      });
      this.closeVehicleModal();
    } else {
      alert('No item selected!');
    }
  }


}
