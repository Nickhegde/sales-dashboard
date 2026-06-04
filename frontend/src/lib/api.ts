const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'

async function fetchAPI<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE_URL}/api/v1${path}`)
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
  const res = await fetch(url.toString(), { cache: 'no-store' })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export const api = {
  getSummary: (days = 365) => fetchAPI<SummaryMetrics>('/metrics/summary/', { days: String(days) }),
  getRevenueTrend: (period = 'monthly', days = 365) => fetchAPI<RevenueTrend>('/metrics/revenue-trend/', { period, days: String(days) }),
  getRevenueByRegion: (days = 365) => fetchAPI<RegionData[]>('/metrics/revenue-by-region/', { days: String(days) }),
  getTopProducts: (limit = 5, days = 365) => fetchAPI<ProductData[]>('/metrics/top-products/', { limit: String(limit), days: String(days) }),
  getSalesFunnel: (days = 365) => fetchAPI<FunnelStage[]>('/metrics/sales-funnel/', { days: String(days) }),
  getTransactions: (page = 1, days = 365) => fetchAPI<TransactionPage>('/transactions/', { page: String(page), days: String(days) }),
  getExportUrl: (days = 365) => `${BASE_URL}/api/v1/transactions/export/?days=${days}`,
}

export interface SummaryMetrics {
  total_revenue: number
  revenue_change_pct: number
  total_deals: number
  deals_change_pct: number
  avg_deal_size: number
  avg_deal_change_pct: number
  win_rate: number
  win_rate_change_pct: number
  as_of: string
  period_days: number
}

export interface RevenueTrend {
  labels: string[]
  current_year: number[]
  previous_year: number[]
  period: string
}

export interface RegionData {
  region: string
  revenue: number
  share_pct: number
  change_pct: number
}

export interface ProductData {
  product: string
  revenue: number
  units: number
  avg_price: number
}

export interface FunnelStage {
  stage: string
  count: number
  conversion_pct: number | null
}

export interface TransactionPage {
  page: number
  per_page: number
  total: number
  results: Transaction[]
}

export interface Transaction {
  id: string
  date: string
  customer: string
  product: string
  region: string
  rep: string
  amount: number
  status: string
}