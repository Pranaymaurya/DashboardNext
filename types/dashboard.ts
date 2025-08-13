export interface KYCStats {
  newKYC: {
    count: number
    change: number
  }
  modifiedKYC: {
    count: number
    change: number
  }
  totalKYCs: number
}

export interface ComparisonData {
  category: string
  today: number
  yesterday: number
}

export interface CategoriesData {
  individual: {
    ri: number
    nri: number
  }
  nonIndividual: {
    ri: number
    nri: number
  }
}

export interface StatusCard {
  label: string
  count: number
  icon: string
  color: string
}

export interface SolicitedData {
  solicited: number
  received: number
  consumed: number
  pending: number
}

export interface PANDataStats {
  pansSolicited: {
    total: number
    withImage: number
    withoutImage: number
  }
  dataReceived: {
    total: number
    withImage: number
    withoutImage: number
  }
}

export interface DashboardData {
  kycStats: KYCStats
  comparisonData: ComparisonData[]
  categoriesData: CategoriesData
  statusCards: StatusCard[]
  solicitedData: SolicitedData
  panDataStats: PANDataStats
}
