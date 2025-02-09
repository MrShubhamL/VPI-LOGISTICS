const userPermissionsList = [
  {
    title: 'Master Access',
    permission: [
      'create-account', 'create-party', 'item-records', 'manage-route', 'vehicle-registration', 'user-management', 'create-branch'
    ]
  },
  {
    title: 'Transaction Access',
    permission: [
      'lorry-receipt', 'mis', 'lorry-requests', 'lorry-receipt-temp', 'lorry-hire-memo',
      'freight-bill', 'bill-submission', 'octroi-bill', 'customer-receipt',
      'trip-expenses-voucher', 'other-receipt', 'other-payments', 'journal'
    ]
  },
  {
    title: 'Report Access',
    permission: [
      'booking-register', 'booking-register-II', 'outsider-truck-register', 'company-truck-register',
      'provision-of-billing', 'ledger', 'party-ledger', 'cash-book', 'bank-book', 'trial-balance',
      'sundry-drs-list', 'sundry-crs-list', 'merge'
    ]
  }
];

export default userPermissionsList;
