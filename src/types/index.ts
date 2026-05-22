export type OutletStatus = 'enumerated' | 'pending_onboarding' | 'active_customer' | 'rejected';
export type UserRole = 'admin' | 'enumeration' | 'onboarding';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
  name: string;
  isApproved?: boolean;
}

export interface OnboardingChecklist {
  detailsVerified: boolean;
  contactConfirmed: boolean;
  classApproved: boolean;
  routeAssigned: boolean;
  productListExplained: boolean;
  priceListExplained: boolean;
  cutoffTimeExplained: boolean;
  paymentRuleExplained: boolean;
  creditStatusConfirmed: boolean;
  deliveryTimeAgreed: boolean;
  returnPolicyExplained: boolean;
  complaintChannelShared: boolean;
  addedToActiveList: boolean;
}

export interface EvaluationMatrix {
  footTraffic: number;
  breadSalesVolume: number;
  paymentReliability: number;
  routeFit: number;
  storageHygiene: number;
  productInterest: number;
  preOrderReadiness: number;
  growthPotential: number;
}

export interface Outlet {
  id: string;
  name: string;
  type: string;
  address: string;
  landmark: string;
  town: string;
  latitude?: string;
  longitude?: string;
  gps: string;
  ownerName: string;
  contactPerson: string;
  phone: string;
  whatsapp: string;
  email?: string;
  openingTime: string;
  closingTime: string;
  
  // Market Data
  currentSupplier: string;
  avgDailySales: string;
  bestSellingSize: string;
  peakSalesTime: string;
  currentBuyingPrice: string;
  currentSellingPrice: string;
  mainCustomerType: string;
  storageCondition: string;
  sellSnacksDrinks: boolean;

  // Supply Interest
  preferredProducts: string[];
  expectedDailyQuantity: string;
  preferredDeliveryTime: string;
  paymentMethod: string[];
  preOrderCycle: 'Morning' | 'Afternoon' | 'Evening';
  deliveryCycle: 'Morning' | 'Afternoon' | 'Evening';
  canPayBeforeDelivery: string;
  interestedInVilla: 'Yes' | 'No' | 'Maybe';
  creditRequestDetails?: string;
  specialRequirements?: string;

  // Evaluation & Scoring
  evaluation?: EvaluationMatrix;
  totalScore?: number;
  recommendedClass?: 'A' | 'B' | 'C' | 'D' | 'Watchlist';
  recommendedAction?: 'Approve' | 'Pilot' | 'Revisit' | 'Reject';
  supervisorReview?: string;
  managementApproval?: string;
  
  // Photos
  photoUrls?: string[];

  // Metadata
  status: OutletStatus;
  fieldOfficerName: string;
  fieldOfficerUid: string;
  dateVisited: string;
  createdAt: any;
  updatedAt: any;

  // Onboarding
  onboardingChecklist?: OnboardingChecklist;
  route?: string;
  firstSupplyDate?: string;
  approvedCreditLimit?: string;
  physicalDocumentSigned?: boolean;
  activationDetails?: {
    representativeName: string;
    onboardingStaffUid: string;
    date: string;
  };
}
