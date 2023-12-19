export const SEGMENTS_HEADER = [
  { id: 1, header: 'No', accessor: 'segmentId', sortable: false },
  { id: 2, header: 'Segment Name', accessor: 'segmentName' },
  { id: 3, header: 'Campaigns', accessor: 'campaigns' },
  { id: 4, header: 'Status', accessor: 'status' },
  { id: 5, header: 'Created By', accessor: 'createdBy' },
  {
    id: 6,
    header: 'Created Date',
    accessor: 'createdAt',
  },
];

export const SEGMENTS_FILTERS = [
  { id: 1, label: 'Status', value: 'segment-status' },
  { id: 2, label: 'Created Date', value: 'created-date' },
  { id: 3, label: 'Campaigns', value: 'campaigns' },
];

export const SEGMENTS_ACTIONS = [{ id: 1, label: 'Delete', value: 'delete' }];

export const SEGMENT_TEMPLATE = [
  'segment_name',
  'lastname',
  'firstname',
  'middlename',
  'birthdate',
  'gender',
  'email',
  'civil_status',
  'primary_contact_no',
  'secondary_contact_no',
  'region',
  'municipality',
  'barangay',
  'street_address',
  'subdivision',
  'nearest_landmark',
  'contact_type',
  'idmsId',
];

export const CONTACT_TEMPLATE = [
  'lastname',
  'firstname',
  'middlename',
  'birthdate',
  'gender',
  'email',
  'civil_status',
  'contact_no',
  'region',
  'municipality',
  'barangay',
  'street_address',
  'subdivision',
  'nearest_landmark',
  'contact_type',
];

export const ADD_FROM_SOURCES_TABS = ['Contacts', 'Existing Segments'];

export const CONTACTS_FIELDS = [
  {
    header: 'Pre-Defined Field',
    fields: [
      { name: 'Last Name', value: 'lastName' },
      { name: 'First Name', value: 'firstName' },
      { name: 'Middle Name', value: 'middleName' },
      { name: 'Birthdate', value: 'birthdate' },
      { name: 'Gender', value: 'gender' },
      { name: 'Email', value: 'email' },
      { name: 'Username', value: 'username' },
      { name: 'Civil Status', value: 'civilStatus' },
      { name: 'Primary Contact No.', value: 'primaryContactNo' },
      { name: 'Secondary Contact No.', value: 'secondaryContactNo' },
      { name: 'Address', value: 'address' },
      { name: 'Status', value: 'status' },
      { name: 'Discount ID', value: 'discountId' },
      { name: 'Updated At', value: 'updatedAt' },
      { name: 'Added At', value: 'addedAt' },
      { name: 'User Type', value: 'userType' },
    ],
  },
  {
    header: 'Orders',
    fields: [
      { name: 'Order ID', value: 'orderId' },
      { name: 'Ordered On', value: 'orderedOn' },
      { name: 'Total Purchased Item', value: 'totalPurchasedItem' },
      { name: 'Channel', value: 'channel' },
      { name: 'Platform', value: 'platform' },
      { name: 'Order Status', value: 'orderStatus' },
      { name: 'Tracking No.', value: 'trackingNo' },
      { name: 'Pinned Address', value: 'pinnedAddress' },
      { name: 'Action to Proceed', value: 'actionToProceed' },
      { name: 'No. of Transactions', value: 'noOfTransactions' },
      { name: 'Have Purchased', value: 'havePurchased' },
      { name: 'Have Not Purchased', value: 'haveNotPurchased' },
      { name: 'Average Amount Spent', value: 'averageAmount Spent' },
      { name: 'Amount Spent per Order', value: 'amountSpentPerOrder' },
      { name: 'Total Amount Spent', value: 'totalAmountSpent' },
      { name: 'Fulfillment', value: 'fulfillment' },
    ],
  },
  {
    header: 'Payment',
    fields: [
      { name: 'Payment Method', value: 'paymentMethod' },
      { name: 'Payment Status', value: 'paymentStatus' },
      { name: 'Invoice Status', value: 'invoiceStatus' },
      { name: 'Discount', value: 'discount' },
    ],
  },
  {
    header: 'Membership',
    fields: [
      { name: 'Membership ID', value: 'membershipId' },
      { name: 'Membership Expiry', value: 'membershipExpiry' },
      { name: 'Membership Type', value: 'membershipType' },
      { name: 'Membership Name', value: 'membershipName' },
      { name: 'Membership Gender', value: 'membershipGender' },
      { name: 'Membership Nationality', value: 'membershipNationality' },
      { name: 'Membership Address', value: 'membershipAddress' },
    ],
  },
  {
    header: 'Store',
    fields: [
      { name: 'Industry', value: 'industry' },
      { name: 'Merchant', value: 'merchant' },
      { name: 'Branch', value: 'branch' },
      { name: 'Store Address', value: 'storeAddress' },
      { name: 'Store Contact No.', value: 'storeContactNo' },
    ],
  },
  {
    header: 'Rider',
    fields: [
      { name: 'Agency', value: 'agency' },
      { name: 'Rider Username', value: 'riderUsername' },
      { name: 'Rider Name', value: 'riderName' },
      { name: 'Rider ID', value: 'riderId' },
      { name: 'Rider Contact No.', value: 'riderContactNo' },
      { name: 'Rider Email Address', value: 'riderEmailAddress' },
      { name: 'Plate No.', value: 'plateNo' },
      { name: 'Booking ID', value: 'bookingId' },
      { name: 'Tracking Link', value: 'trackingLink' },
      { name: 'Collected At', value: 'collectedAt' },
      { name: 'Delivered At', value: 'deliveredAt' },
    ],
  },
  {
    header: 'Loyalty',
    fields: [{ name: 'Earned Points', value: 'earnedPoints' }],
  },
  {
    header: 'Campaign Activity',
    fields: [
      { name: 'Last Sent On', value: 'lastSentOn' },
      { name: 'Campaigns Sent', value: 'campaignsSent' },
      { name: 'Response', value: 'response' },
      { name: 'Response Date', value: 'responseDate' },
    ],
  },
];

export const CONTACTS_HEADERS = [
  { id: 1, header: 'ID', accessor: 'id' },
  { id: 2, header: 'Name', accessor: 'name' },
  { id: 3, header: 'Email', accessor: 'email' },
  { id: 4, header: 'Mobile', accessor: 'mobile' },
  { id: 5, header: 'Address', accessor: 'address' },
  // { id: 6, header: 'Status', accessor: 'status' },
  { id: 7, header: 'Date Added', accessor: 'dateAdded' },
];

export const PREVIEW_SEGMENT_CONTACTS_HEADERS = [
  { id: 1, header: 'ID', accessor: 'id' },
  { id: 2, header: 'Name', accessor: 'name' },
  { id: 3, header: 'Email', accessor: 'email' },
  { id: 4, header: 'Primary Contact Number', accessor: 'mobile' },
  { id: 5, header: 'Secondary Contact Number', accessor: 'secondaryMobile' },
  { id: 6, header: 'Address', accessor: 'address' },
];

export const VIEW_SEGMENT_CONTACTS_HEADERS = [
  { id: 1, header: 'ID', accessor: 'id' },
  { id: 2, header: 'Name', accessor: 'name' },
  { id: 3, header: 'Type', accessor: 'type' },
  { id: 4, header: 'Email', accessor: 'email' },
  { id: 5, header: 'Mobile', accessor: 'mobile' },
  { id: 6, header: 'Modified By', accessor: 'modifiedBy' },
  { id: 7, header: 'Latest Modifed', accessor: 'latestModified' },
];

export const CAMPAIGNS_HEADER = [
  { id: 1, header: 'ID', accessor: 'campaignId' },
  { id: 2, header: 'Name', accessor: 'name' },
  { id: 3, header: 'Segments', accessor: 'segments' },
  { id: 4, header: 'Category', accessor: 'category' },
  { id: 5, header: 'Channel', accessor: 'channel' },
  { id: 6, header: 'Schedule', accessor: 'type' },
  { id: 7, header: 'Status', accessor: 'activeStatus' },
];

export const CAMPAIGNS_ACTIONS = [
  { id: 1, label: 'Delete', value: 'delete' },
  { id: 2, label: 'Deactivate', value: 'deactivate' },
];

export const CAMPAIGNS_FILTERS = [
  { id: 1, label: 'Status', value: 'campaign-status' },
  { id: 2, label: 'Schedule', value: 'schedule' },
  { id: 3, label: 'Category', value: 'category' },
];

export const MAX_BULK_ACTION_ITEMS = 50;

export const MAX_SUBJECT_CHARACTER_LIMIT = 160;

export const MAX_PREVIEW_TEXT_CHARACTER_LIMIT = 240;

export const CAMPAIGN_NAME_CHARACTER_LIMIT = 150;

export const MERCHANT_ID = 3;
