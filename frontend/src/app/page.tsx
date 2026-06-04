import { api } from '@/lib/api'
import Sidebar from '@/components/layout/Sidebar'
import MetricCard from '@/components/ui/MetricCard'
import RevenueTrendChart from '@/components/charts/RevenueTrendChart'
import TopProductsChart from '@/components/charts/TopProductsChart'
import SalesFunnel from '@/components/charts/SalesFunnel'
import DateRangeFilter from '@/components/ui/DateRangeFilter'

const fmtRevenue = (v: number) =>
  v >= 1_000_000 ? `$${(v / 1_000_000).toFixed(1)}M` : `$${(v / 1000).toFixed(0)}K`

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { days?: string }
}) {
  const days = parseInt(searchParams.days || '365')

  const [summary, trend, products, funnel, regions] = await Promise.all([
    api.getSummary(days),
    api.getRevenueTrend('monthly', days),
    api.getTopProducts(5, days),
    api.getSalesFunnel(days),
    api.getRevenueByRegion(days),
  ])

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main style={{ marginLeft: 220, flex: 1, padding: '2rem', maxWidth: 1200 }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
              Sales Overview
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>as of {summary.as_of}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <DateRangeFilter current={days} basePath="/" />
            <div style={{
              fontSize: 12, color: '#22c55e',
              background: 'rgba(34,197,94,0.1)',
              padding: '5px 12px', borderRadius: 20,
              border: '1px solid rgba(34,197,94,0.2)',
              display: 'flex', alignItems: 'center', gap: 6
            }}>
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: '#22c55e', display: 'inline-block',
                animation: 'blink 1.4s ease-in-out infinite'
              }} />
              Live
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: '2rem' }}>
          <MetricCard label="Total Revenue" value={fmtRevenue(summary.total_revenue)}
            change={summary.revenue_change_pct} subtitle="vs prior period" />
          <MetricCard label="Total Deals" value={summary.total_deals.toLocaleString()}
            change={summary.deals_change_pct} subtitle="closed" />
          <MetricCard label="Avg Deal Size" value={fmtRevenue(summary.avg_deal_size)}
            change={summary.avg_deal_change_pct} />
          <MetricCard label="Win Rate" value={`${summary.win_rate}%`}
            change={summary.win_rate_change_pct} />
        </div>

        {/* Charts row 1 */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
          <RevenueTrendChart data={trend} />
          <SalesFunnel data={funnel} />
        </div>

        {/* Charts row 2 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <TopProductsChart data={products} />
          <div className="card">
            <span className="label" style={{ display: 'block', marginBottom: '1.25rem' }}>Revenue by Region</span>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Region','Revenue','Share','YoY'].map(h => (
                    <th key={h} style={{ textAlign: h === 'Region' ? 'left' : 'right', fontSize: 11,
                      color: 'var(--text-muted)', fontWeight: 500, paddingBottom: 10,
                      borderBottom: '1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {regions.map((r, i) => (
                  <tr key={r.region} style={{ borderBottom: i < regions.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <td style={{ padding: '10px 0', fontSize: 13 }}>{r.region}</td>
                    <td style={{ textAlign: 'right', fontSize: 13, fontWeight: 500 }}>
                      ${(r.revenue / 1_000_000).toFixed(1)}M
                    </td>
                    <td style={{ textAlign: 'right', fontSize: 12, color: 'var(--text-secondary)' }}>
                      {r.share_pct}%
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={r.change_pct >= 0 ? 'badge-up' : 'badge-down'} style={{ fontSize: 11 }}>
                        {r.change_pct >= 0 ? '↑' : '↓'} {Math.abs(r.change_pct)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  )
}